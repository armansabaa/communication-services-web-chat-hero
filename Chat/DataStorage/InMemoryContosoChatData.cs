// © Microsoft Corporation. All rights reserved.

using Azure.Core;
using System.Collections.Generic;
using System.Text.Json;

namespace Chat
{
    public class InMemoryChatAdminThreadStore : IChatAdminThreadStore
    {
        public Dictionary<string, string> Store { get; }

        public Dictionary<string, ContosoUserConfigModel> UseConfigStore { get; }

        /// <summary>
        /// To maintain a storage of all of the chat threads and their associated moderater "users" to add in new users
        /// </summary>
        public InMemoryChatAdminThreadStore()
        {
            Store = new Dictionary<string, string>();
            UseConfigStore = new Dictionary<string, ContosoUserConfigModel>();
            initializeHardCodedValues();
        }

        private void initializeHardCodedValues()
        {
            var eventInfo = new ACSEvent
            {
                Id = "acs_ve_06_07_2021",
                ChatSession = new AcsChatSession
                {
                    ThreadId = "19:YmjddgUQEvDM6hRDD8eGFTK4fdbqpRD-jVME8zwjed81@thread.v2",
                    ThreadModeratorId = "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000a-e65d-db6b-f40f-343a0d00c1d6",
                },
                Rooms = new Dictionary<string, ACSRoom>()
                {
                    { 
                        "room1",
                        new ACSRoom
                        {
                            Id = "room1",
                            Title = "Global All Hands",
                            ChatSession = new AcsChatSession
                            {
                                ThreadId = "19:s_701MHt__nd5NJT_IZ-zRnSvOTlQ-1pBmGI0xyieHQ1@thread.v2",
                                ThreadModeratorId = "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000b-0805-adef-b5bb-a43a0d002005",
                            },
                            CallingSessionId = "4fa24250-d478-11eb-a4fa-bb783cfd38e0"
                        }
                    },
                    {
                        "room2",
                        new ACSRoom
                        {
                            Id = "room2",
                            Title = "Product Demos"
                        }
                    },
                    {
                        "room3",
                        new ACSRoom
                        {
                            Id = "room3",
                            Title = "Ask Me Anything"
                        }
                    }
                }
            };

            Store.Add("acs_ve_06_07_2021", JsonSerializer.Serialize(eventInfo));
        }
    }
}
