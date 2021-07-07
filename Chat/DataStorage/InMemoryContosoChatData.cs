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
            Store.Add("19:NiPwoXBkYJxAbDcJ6t3G8uBGUeSxIvOGCO8DNcOD4LA1@thread.v2", "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000b-2235-ada8-eef0-8b3a0d001ed4");
            Store.Add("19:9XXzSF-RWvk7abVPgf61wHPCw4cc9ZtMsa7EtfKwJ9I1@thread.v2", "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000b-2236-bc5e-eef0-8b3a0d001ef6");
        }
    }
}
