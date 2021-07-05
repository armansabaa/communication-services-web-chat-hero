// © Microsoft Corporation. All rights reserved.

using Azure.Core;
using System.Collections.Generic;
using System.Text.Json;

namespace Chat
{
    public class InMemoryEventsStore : IEventsStore
    {
        public Dictionary<string, ACSEvent> Store { get; }

        public Dictionary<string, ContosoUserConfigModel> UseConfigStore { get; }

        /// <summary>
        /// Maintain a storage of all of the events and associated event information
        /// </summary>
        public InMemoryEventsStore()
        {
            Store = new Dictionary<string, ACSEvent>();
            InitializeHardCodedValues();
        }

        private void InitializeHardCodedValues()
        {
            var eventInfo = new ACSEvent
            {
                Id = "acs_ve_06_07_2021",
                ChatSessionThreadId = "19:YmjddgUQEvDM6hRDD8eGFTK4fdbqpRD-jVME8zwjed81@thread.v2",
                Rooms = new Dictionary<string, ACSRoom>()
                {
                    { 
                        "room1",
                        new ACSRoom
                        {
                            Id = "room1",
                            Title = "Global All Hands",
                            ChatSessionThreadId = "19:4YD7S71M4TG0HEQWahNcgYfQ4KsYPjPdkKgHmDpEoSc1@thread.v2",
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

            Store.Add("acs_ve_06_07_2021", eventInfo);
        }
    }
}
