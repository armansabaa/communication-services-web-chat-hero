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
            InitializeHardCodedValues();
        }

        //TODO: What do we do with the ContosoUserConfigModel?
        //This maps threadId > moderatorUid
        private void InitializeHardCodedValues()
        {
            Store.Add("19:YmjddgUQEvDM6hRDD8eGFTK4fdbqpRD-jVME8zwjed81@thread.v2", "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000a-e65d-db6b-f40f-343a0d00c1d6");
            Store.Add("19:4YD7S71M4TG0HEQWahNcgYfQ4KsYPjPdkKgHmDpEoSc1@thread.v2", "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000a-baef-95a7-28c5-593a0d000c31");
        }
    }
}
