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
            Store.Add("19:Ytl68hCH36NP5lQFE_EQain8ACl9qOiSdw2dytem4QM1@thread.v2", "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000b-17b9-7405-54b7-a43a0d0017fa");
            Store.Add("19:gD9iUbus0ZWQjGJ-oATDlX4cu8wH6FeJE7uPe2LFLUQ1@thread.v2", "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000b-17b5-ce49-80f5-8b3a0d00e461");
        }
    }
}
