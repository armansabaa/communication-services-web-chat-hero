using Chat.Models;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.EventHubs;
using Microsoft.Azure.EventHubs.Processor;
using Microsoft.Azure.Management.Media;
using Microsoft.Azure.Management.Media.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Chat.Services.LiveStreaming
{
	public class LiveStreamingService : ILiveStreamingService
	{
		private readonly LiveStreamSetting _config;
		private readonly IMediaServiceClientFactory _mediaServiceClientFactory;
		private LiveStreamStartedResult _startupResult;

		private string _liveEventName;
		private string _assetName;
		private string _liveOutputName;
		private string _streamingLocatorName;
		private string _streamingEndpointName;
		private EventProcessorHost _eventProcessorHost;

		public LiveStreamingService(IConfiguration appConfiguration, IMediaServiceClientFactory mediaServiceClientFactory)
		{
			_config = new LiveStreamSetting(appConfiguration);
			_mediaServiceClientFactory = mediaServiceClientFactory;
		}

		public async Task<LiveStreamStartedResult> Start(string roomId)
		{
			// TODO: track live stream in each room

			if (_startupResult != null)
				return _startupResult;

			_startupResult = new LiveStreamStartedResult();

			IAzureMediaServicesClient serviceClient = await _mediaServiceClientFactory.CreateMediaServicesClientAsync(_config);

			string uniqueness = Guid.NewGuid().ToString().Substring(0, 13); // Create a GUID for uniqueness. You can make this something static if you dont want to change RTMP ingest settings in OBS constantly.  
			_liveEventName = "liveevent-" + uniqueness; // WARNING: Be careful not to leak live events using this sample!
			_assetName = "archiveAsset" + uniqueness;
			_liveOutputName = "liveOutput" + uniqueness;
			string drvStreamingLocatorName = "streamingLocator" + uniqueness;
			string archiveStreamingLocatorName = "fullLocator-" + uniqueness;
			string drvAssetFilterName = "filter-" + uniqueness;
			_streamingLocatorName = "streamingLocator" + uniqueness;
			_streamingEndpointName = "default"; // Change this to your specific streaming endpoint name if not using "default"
			_eventProcessorHost = null;

			MediaService mediaService = await serviceClient.Mediaservices.GetAsync(_config.ResourceGroup, _config.AccountName);
			IPRange allAllowIPRange = new IPRange(
					name: "AllowAll",
					address: "0.0.0.0",
					subnetPrefixLength: 0
				);
			LiveEventInputAccessControl liveEventInputAccess = new LiveEventInputAccessControl()
			{
				Ip = new IPAccessControl(
							allow: new IPRange[]
							{
								// re-use the same range here for the sample, but in production you can lock this
								// down to the ip range for your on-premises live encoder, laptop, or device that is sending
								// the live stream
								allAllowIPRange
							}
						)

			};
			LiveEventPreview liveEventPreview = new LiveEventPreview()
			{
				AccessControl = new LiveEventPreviewAccessControl(
						ip: new IPAccessControl(
							allow: new IPRange[]
							{
								// re-use the same range here for the sample, but in production you can lock this to the IPs of your 
								// devices that would be monitoring the live preview. 
								allAllowIPRange
							}
						)
					)
			};
			LiveEvent liveEvent = new LiveEvent(
					location: mediaService.Location,
					description: "Sample LiveEvent from .NET SDK sample",
					// Set useStaticHostname to true to make the ingest and preview URL host name the same. 
					// This can slow things down a bit. 
					useStaticHostname: true,

					// 1) Set up the input settings for the Live event...
					input: new LiveEventInput(
						streamingProtocol: LiveEventInputProtocol.RTMP,  // options are RTMP or Smooth Streaming ingest format.
																		 // This sets a static access token for use on the ingest path. 
																		 // Combining this with useStaticHostname:true will give you the same ingest URL on every creation.
																		 // This is helpful when you only want to enter the URL into a single encoder one time for this Live Event name
						accessToken: "acf7b6ef-8a37-425f-b8fc-51c2d6a5a86a",  // Use this value when you want to make sure the ingest URL is static and always the same. If omitted, the service will generate a random GUID value.
						accessControl: liveEventInputAccess, // controls the IP restriction for the source encoder.
						keyFrameIntervalDuration: "PT2S" // Set this to match the ingest encoder's settings
					),
					// 2) Set the live event to use pass-through or cloud encoding modes...
					encoding: new LiveEventEncoding(
						// Set this to Standard or Premium1080P to use the cloud live encoder.
						// See https://go.microsoft.com/fwlink/?linkid=2095101 for more information
						// Otherwise, leave as "None" to use pass-through mode
						encodingType: LiveEventEncodingType.None // also known as pass-through mode.
																 // OPTIONAL settings when using live cloud encoding type:
																 // keyFrameInterval: "PT2S", //If this value is not set for an encoding live event, the fragment duration defaults to 2 seconds. The value cannot be set for pass-through live events.
																 // presetName: null, // only used for custom defined presets. 
																 //stretchMode: "None" // can be used to determine stretch on encoder mode
					),
					// 3) Set up the Preview endpoint for monitoring based on the settings above we already set.
					preview: liveEventPreview,
					// 4) Set up more advanced options on the live event. Low Latency is the most common one.
					streamOptions: new List<StreamOptionsFlag?>()
					{
						// Set this to Default or Low Latency
						// When using Low Latency mode, you must configure the Azure Media Player to use the 
						// quick start heuristic profile or you won't notice the change. 
						// In the AMP player client side JS options, set -  heuristicProfile: "Low Latency Heuristic Profile". 
						// To use low latency optimally, you should tune your encoder settings down to 1 second GOP size instead of 2 seconds.
						StreamOptionsFlag.LowLatency
					}
			//,
			// 5) Optionally enable live transcriptions if desired. 
			// WARNING : This is extra cost ($$$), so please check pricing before enabling.
			/*transcriptions:new List<LiveEventTranscription>(){
				new LiveEventTranscription(
					// The value should be in BCP-47 format (e.g: 'en-US'). See https://go.microsoft.com/fwlink/?linkid=2133742
					language: "en-us",
					outputTranscriptionTrack : new LiveEventOutputTranscriptionTrack(
						trackName: "English" // set the name you want to appear in the output manifest
					)
				)
			}*/
			);

			try
			{
				// Please refer README for Event Hub and storage settings.
				string StorageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
					_config.StorageAccountName, _config.StorageAccountKey);

				// Create a new host to process events from an Event Hub.
				_eventProcessorHost = new EventProcessorHost(_config.EventHubName,
					PartitionReceiver.DefaultConsumerGroupName, _config.EventHubConnectionString,
					StorageConnectionString, _config.StorageContainerName);

				// Registers the Event Processor Host and starts receiving messages.
				await _eventProcessorHost.RegisterEventProcessorFactoryAsync(new MediaServicesEventProcessorFactory(_liveEventName),
					EventProcessorOptions.DefaultOptions);
			}
			catch (Exception e)
			{
				_eventProcessorHost = null;

				Console.WriteLine("Failed to connect to Event Hub, please refer README for Event Hub and storage settings. Skipping event monitoring...");
				Console.WriteLine(e.Message);
			}

			liveEvent = await serviceClient.LiveEvents.CreateAsync(
					_config.ResourceGroup,
					_config.AccountName,
					_liveEventName,
					liveEvent,
					// When autostart is set to true, you should "await" this method operation to complete. 
					// The Live Event will be started after creation. 
					// You may choose not to do this, but create the object, and then start it using the standby state to 
					// keep the resources "warm" and billing at a lower cost until you are ready to go live. 
					// That increases the speed of startup when you are ready to go live. 
					autoStart: false);

			Asset asset = await serviceClient.Assets.CreateOrUpdateAsync(_config.ResourceGroup, _config.AccountName, _assetName, new Asset());

			string manifestName = "output";
			LiveOutput liveOutput = new LiveOutput(
					assetName: asset.Name,
					manifestName: manifestName, // The HLS and DASH manifest file name. This is recommended to set if you want a deterministic manifest path up front.
												// archive window can be set from 3 minutes to 25 hours. Content that falls outside of ArchiveWindowLength
												// is continuously discarded from storage and is non-recoverable. For a full event archive, set to the maximum, 25 hours.
					archiveWindowLength: TimeSpan.FromHours(1)
				);
			liveOutput = await serviceClient.LiveOutputs.CreateAsync(
				_config.ResourceGroup,
				_config.AccountName,
				_liveEventName,
				_liveOutputName,
				liveOutput);
			await serviceClient.LiveEvents.StartAsync(_config.ResourceGroup, _config.AccountName, _liveEventName);
			// Refresh the liveEvent object's settings after starting it...
			liveEvent = await serviceClient.LiveEvents.GetAsync(_config.ResourceGroup, _config.AccountName, _liveEventName);
			string ingestUrl = liveEvent.Input.Endpoints.First().Url;
			Console.WriteLine($"The RTMP ingest URL to enter into OBS Studio is:");
			Console.WriteLine($"\t{ingestUrl}");
			Console.WriteLine("Make sure to enter a Stream Key into the OBS studio settings. It can be any value or you can repeat the accessToken used in the ingest URL path.");
			Console.WriteLine();

			string previewEndpoint = liveEvent.Preview.Endpoints.First().Url;
			Console.WriteLine($"The preview url is:");
			Console.WriteLine($"\t{previewEndpoint}");
			Console.WriteLine();

			Console.WriteLine($"Open the live preview in your browser and use the Azure Media Player to monitor the preview playback:");
			Console.WriteLine($"\thttps://ampdemo.azureedge.net/?url={previewEndpoint}&heuristicprofile=lowlatency");
			Console.WriteLine();

			AssetFilter drvAssetFilter = new AssetFilter(
				   presentationTimeRange: new PresentationTimeRange(
					   forceEndTimestamp: false,
					   // 10 minute (600) seconds sliding window
					   presentationWindowDuration: 6000000000L,
					   // This value defines the latest live position that a client can seek back to 2 seconds, must be smaller than sliding window.
					   liveBackoffDuration: 20000000L)
				);

			drvAssetFilter = await serviceClient.AssetFilters.CreateOrUpdateAsync(_config.ResourceGroup, _config.AccountName,
				_assetName, drvAssetFilterName, drvAssetFilter);

			IList<string> filters = new List<string>
				{
					drvAssetFilterName
				};
			StreamingLocator locator = await serviceClient.StreamingLocators.CreateAsync(_config.ResourceGroup,
				_config.AccountName,
				drvStreamingLocatorName,
				new StreamingLocator
				{
					AssetName = _assetName,
					StreamingPolicyName = PredefinedStreamingPolicy.ClearStreamingOnly,
					Filters = filters   // Associate the dvr filter with StreamingLocator.
				});

			// Get the default Streaming Endpoint on the account
			StreamingEndpoint streamingEndpoint = await serviceClient.StreamingEndpoints.GetAsync(_config.ResourceGroup, _config.AccountName, _streamingEndpointName);

			// If it's not running, Start it. 
			if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
			{
				await serviceClient.StreamingEndpoints.StartAsync(_config.ResourceGroup, _config.AccountName, _streamingEndpointName);
			}

			var hostname = streamingEndpoint.HostName;
			var scheme = "https";
			List<string> manifests = BuildManifestPaths(scheme, hostname, locator.StreamingLocatorId.ToString(), manifestName);
			Console.WriteLine($"The HLS (MP4) manifest for the Live stream  : {manifests[0]}");
			Console.WriteLine("Open the following URL to playback the live stream in an HLS compliant player (HLS.js, Shaka, ExoPlayer) or directly in an iOS device");
			Console.WriteLine($"{manifests[0]}");
			Console.WriteLine();
			Console.WriteLine($"The DASH manifest for the Live stream is : {manifests[1]}");
			Console.WriteLine("Open the following URL to playback the live stream from the LiveOutput in the Azure Media Player");
			Console.WriteLine($"https://ampdemo.azureedge.net/?url={manifests[1]}&heuristicprofile=lowlatency");
			Console.WriteLine();

			_startupResult = new LiveStreamStartedResult
			{
				PreviewUrl = previewEndpoint,
				LiveOutputUrl = manifests[1],
				IngestUrl = ingestUrl
			};

			return _startupResult;
		}

		public async Task Stop(string roomId)
		{
			// TODO: track live stream in each room

			if (_startupResult == null)
				return;

			_startupResult = null;

			IAzureMediaServicesClient serviceClient = await _mediaServiceClientFactory.CreateMediaServicesClientAsync(_config);
			await CleanupLiveEventAndOutputAsync(serviceClient, _config.ResourceGroup, _config.AccountName, _liveEventName, _liveOutputName);
			await CleanupLocatorandAssetAsync(serviceClient, _config.ResourceGroup, _config.AccountName, _streamingLocatorName, _assetName);

			if (_eventProcessorHost != null)
			{
				await _eventProcessorHost.UnregisterEventProcessorAsync();
			}

			await serviceClient.StreamingEndpoints.StopAsync(_config.ResourceGroup, _config.AccountName, _streamingEndpointName);
		}

		private static async Task CleanupLiveEventAndOutputAsync(IAzureMediaServicesClient client, string resourceGroup, string accountName, string liveEventName, string liveOutputName)
		{
			try
			{
				LiveEvent liveEvent = await client.LiveEvents.GetAsync(resourceGroup, accountName, liveEventName);

				await client.LiveOutputs.DeleteAsync(resourceGroup, accountName, liveEventName, liveOutputName);

				if (liveEvent != null)
				{
					if (liveEvent.ResourceState == LiveEventResourceState.Running)
					{
						// If the LiveEvent is running, stop it and have it remove any LiveOutputs
						await client.LiveEvents.StopAsync(resourceGroup, accountName, liveEventName, removeOutputsOnStop: false);
					}

					// Delete the LiveEvent
					await client.LiveEvents.DeleteAsync(resourceGroup, accountName, liveEventName);
				}
			}
			catch (ApiErrorException e)
			{
				Console.WriteLine("CleanupLiveEventAndOutputAsync -- Hit ApiErrorException");
				Console.WriteLine($"\tCode: {e.Body.Error.Code}");
				Console.WriteLine($"\tCode: {e.Body.Error.Message}");
				Console.WriteLine();
			}
		}

		private static async Task CleanupLocatorandAssetAsync(IAzureMediaServicesClient client, string resourceGroup, string accountName, string streamingLocatorName, string assetName)
		{
			try
			{
				// Delete the Streaming Locator
				await client.StreamingLocators.DeleteAsync(resourceGroup, accountName, streamingLocatorName);

				// Delete the Archive Asset
				await client.Assets.DeleteAsync(resourceGroup, accountName, assetName);
			}
			catch (ApiErrorException e)
			{
				Console.WriteLine("CleanupLocatorandAssetAsync -- Hit ApiErrorException");
				Console.WriteLine($"\tCode: {e.Body.Error.Code}");
				Console.WriteLine($"\tCode: {e.Body.Error.Message}");
				Console.WriteLine();
			}
		}

		private static List<string> BuildManifestPaths(string scheme, string hostname, string streamingLocatorId, string manifestName)
		{
			const string hlsFormat = "format=m3u8-cmaf";
			const string dashFormat = "format=mpd-time-cmaf";

			List<string> manifests = new List<string>();

			var manifestBase = $"{scheme}://{hostname}/{streamingLocatorId}/{manifestName}.ism/manifest";
			var hlsManifest = $"{manifestBase}({hlsFormat})";
			manifests.Add(hlsManifest);

			var dashManifest = $"{manifestBase}({dashFormat})";
			manifests.Add(dashManifest);

			return manifests;
		}

		class MediaServicesEventProcessorFactory : IEventProcessorFactory
		{
			private readonly AutoResetEvent jobWaitingEvent;
			private readonly string jobName;
			private readonly string liveEventName;
			public MediaServicesEventProcessorFactory(string jobName, AutoResetEvent jobWaitingEvent)
			{
				this.jobName = jobName;
				this.jobWaitingEvent = jobWaitingEvent;
				this.liveEventName = null;
			}

			public MediaServicesEventProcessorFactory(string liveEventName)
			{
				this.jobName = null;
				this.jobWaitingEvent = null;
				this.liveEventName = liveEventName;
			}

			IEventProcessor IEventProcessorFactory.CreateEventProcessor(PartitionContext context)
			{
				return new MediaServicesEventProcessor(jobName, jobWaitingEvent, liveEventName);
			}
		}

		class MediaServicesEventProcessor : IEventProcessor
		{
			private readonly AutoResetEvent jobWaitingEvent;
			private readonly string jobName;
			private readonly string liveEventName;

			public MediaServicesEventProcessor(string jobName, AutoResetEvent jobWaitingEvent, string liveEventName)
			{
				this.jobName = jobName;
				this.jobWaitingEvent = jobWaitingEvent;
				this.liveEventName = liveEventName;
			}

			public Task CloseAsync(PartitionContext context, CloseReason reason)
			{
				Console.WriteLine($"Processor Shutting Down. Partition '{context.PartitionId}', Reason: '{reason}'.");
				return Task.CompletedTask;
			}

			public Task OpenAsync(PartitionContext context)
			{
				Console.WriteLine($"SimpleEventProcessor initialized. Partition: '{context.PartitionId}'");
				return Task.CompletedTask;
			}

			public Task ProcessErrorAsync(PartitionContext context, Exception error)
			{
				Console.WriteLine($"Error on Partition: {context.PartitionId}, Error: {error.Message}");
				return Task.CompletedTask;
			}

			public Task ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
			{
				foreach (var eventData in messages)
				{
					PrintJobEvent(eventData);
				}

				return context.CheckpointAsync();
			}

			/// <summary>
			/// Parse and print Media Services events.
			/// </summary>
			/// <param name="eventData">Event Hub event data.</param>
			private void PrintJobEvent(EventData eventData)
			{
				var data = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count);
				JArray jArr = JsonConvert.DeserializeObject<JArray>(data);
				foreach (JObject jObj in jArr)
				{
					string eventType = (string)jObj.GetValue("eventType");
					string subject = (string)jObj.GetValue("subject");
					string eventName = Regex.Replace(subject, @"^.*/", "");
					if (eventName != jobName && eventName != liveEventName)
					{
						return;
					}

					switch (eventType)
					{
						// Job state change events
						case "Microsoft.Media.JobStateChange":
						case "Microsoft.Media.JobScheduled":
						case "Microsoft.Media.JobProcessing":
						case "Microsoft.Media.JobCanceling":
						case "Microsoft.Media.JobFinished":
						case "Microsoft.Media.JobCanceled":
						case "Microsoft.Media.JobErrored":
							{
								MediaJobStateChangeEventData jobEventData = jObj.GetValue("data").ToObject<MediaJobStateChangeEventData>();

								Console.WriteLine($"Job state changed for JobId: {eventName} PreviousState: {jobEventData.PreviousState} State: {jobEventData.State}");

								// For final states, send a message to notify that the job has finished.
								if (eventType == "Microsoft.Media.JobFinished" || eventType == "Microsoft.Media.JobCanceled" || eventType == "Microsoft.Media.JobErrored")
								{
									// Job finished, send a message.
									if (jobWaitingEvent != null)
									{
										jobWaitingEvent.Set();
									}
								}
							}
							break;

						// Job output state change events
						case "Microsoft.Media.JobOutputStateChange":
						case "Microsoft.Media.JobOutputScheduled":
						case "Microsoft.Media.JobOutputProcessing":
						case "Microsoft.Media.JobOutputCanceling":
						case "Microsoft.Media.JobOutputFinished":
						case "Microsoft.Media.JobOutputCanceled":
						case "Microsoft.Media.JobOutputErrored":
							{
								MediaJobOutputStateChangeEventData jobEventData = jObj.GetValue("data").ToObject<MediaJobOutputStateChangeEventData>();

								Console.WriteLine($"Job output state changed for JobId: {eventName} PreviousState: {jobEventData.PreviousState} " +
									$"State: {jobEventData.Output.State} Progress: {jobEventData.Output.Progress}%");
							}
							break;

						// Job output progress event
						case "Microsoft.Media.JobOutputProgress":
							{
								MediaJobOutputProgressEventData jobEventData = jObj.GetValue("data").ToObject<MediaJobOutputProgressEventData>();

								Console.WriteLine($"Job output progress changed for JobId: {eventName} Progress: {jobEventData.Progress}%");
							}
							break;

						// LiveEvent Stream-level events
						case "Microsoft.Media.LiveEventConnectionRejected":
							{
								MediaLiveEventConnectionRejectedEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventConnectionRejectedEventData>();
								Console.WriteLine($"LiveEvent connection rejected. IngestUrl: {liveEventData.IngestUrl} StreamId: {liveEventData.StreamId} " +
									$"EncoderIp: {liveEventData.EncoderIp} EncoderPort: {liveEventData.EncoderPort}");
							}
							break;
						case "Microsoft.Media.LiveEventEncoderConnected":
							{
								MediaLiveEventEncoderConnectedEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventEncoderConnectedEventData>();
								Console.WriteLine($"LiveEvent encoder connected. IngestUrl: {liveEventData.IngestUrl} StreamId: {liveEventData.StreamId} " +
									$"EncoderIp: {liveEventData.EncoderIp} EncoderPort: {liveEventData.EncoderPort}");
							}
							break;
						case "Microsoft.Media.LiveEventEncoderDisconnected":
							{
								MediaLiveEventEncoderDisconnectedEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventEncoderDisconnectedEventData>();
								Console.WriteLine($"LiveEvent encoder disconnected. IngestUrl: {liveEventData.IngestUrl} StreamId: {liveEventData.StreamId} " +
									$"EncoderIp: {liveEventData.EncoderIp} EncoderPort: {liveEventData.EncoderPort}");
							}
							break;

						// LiveEvent Track-level events
						case "Microsoft.Media.LiveEventIncomingDataChunkDropped":
							{
								MediaLiveEventIncomingDataChunkDroppedEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventIncomingDataChunkDroppedEventData>();
								Console.WriteLine($"LiveEvent data chunk dropped. LiveEventId: {eventName} ResultCode: {liveEventData.ResultCode}");
							}
							break;
						case "Microsoft.Media.LiveEventIncomingStreamReceived":
							{
								MediaLiveEventIncomingStreamReceivedEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventIncomingStreamReceivedEventData>();
								Console.WriteLine($"LiveEvent incoming stream received. IngestUrl: {liveEventData.IngestUrl} EncoderIp: {liveEventData.EncoderIp} " +
									$"EncoderPort: {liveEventData.EncoderPort}");
							}
							break;
						case "Microsoft.Media.LiveEventIncomingStreamsOutOfSync":
							{
								//MediaLiveEventIncomingStreamsOutOfSyncEventData eventData = jObj.GetValue("data").ToObject<MediaLiveEventIncomingStreamsOutOfSyncEventData>();
								Console.WriteLine($"LiveEvent incoming audio and video streams are out of sync. LiveEventId: {eventName}");
							}
							break;
						case "Microsoft.Media.LiveEventIncomingVideoStreamsOutOfSync":
							{
								//MediaLiveEventIncomingVideoStreamsOutOfSyncEventData eventData =jObj.GetValue("data").ToObject<MediaLiveEventIncomingVideoStreamsOutOfSyncEventData>();
								Console.WriteLine($"LeveEvent incoming video streams are out of sync. LiveEventId: {eventName}");
							}
							break;
						case "Microsoft.Media.LiveEventIngestHeartbeat":
							{
								MediaLiveEventIngestHeartbeatEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventIngestHeartbeatEventData>();
								Console.WriteLine($"LiveEvent ingest heart beat. TrackType: {liveEventData.TrackType} State: {liveEventData.State} Healthy: {liveEventData.Healthy}");
							}
							break;
						case "Microsoft.Media.LiveEventTrackDiscontinuityDetected":
							{
								MediaLiveEventTrackDiscontinuityDetectedEventData liveEventData = jObj.GetValue("data").ToObject<MediaLiveEventTrackDiscontinuityDetectedEventData>();
								Console.WriteLine($"LiveEvent discontinuity in the incoming track detected. LiveEventId: {eventName} TrackType: {liveEventData.TrackType} " +
									$"Discontinuity gap: {liveEventData.DiscontinuityGap}");
							}
							break;
					}
				}
			}
		}

	}
}
