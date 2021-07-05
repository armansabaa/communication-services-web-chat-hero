// © Microsoft Corporation. All rights reserved.

using System.Collections.Generic;

namespace Chat
{
	public interface IEventsStore
	{
		// [event id -> moderator id] 
		Dictionary<string, ACSEvent> Store { get; }
	}

	public interface IChatAdminThreadStore
	{
		// [thread id -> moderator id] 
		Dictionary<string, string> Store { get; }

		// [mri -> emoji]
		Dictionary<string, ContosoUserConfigModel> UseConfigStore { get; }
	}
}
