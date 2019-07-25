import { BaseAnalyzer } from './baseAnalyzer.js';
import { LoadBar } from '../components/loadBar.js';

class FBAnalyzer extends BaseAnalyzer {
   constructor(file, data, callback) {
      super();
      this.username = 'Stoyan Shukerov';
      this.callback = callback;
      this.progress = null;
      this.init(file, data);

      // this.userName = null;
   }
   
   init(file, data) {
      console.log(file);
      this.fs.importBlob(file, () => {
         // NEEDED FOR MESSAGES
         let profileInfoFile = this.getJSONFile('profile_information/profile_information.json');
         profileInfoFile.getText(this.getBaseData.bind(this, data));

         // this.getBaseData.bind(this, data);

         // NOT GOOD BECAUSE CALLBACK NEEDS TO BE SET TO NULL AFTER EXECUTE
         // YOU NEED TO KEEP THE STATE RIGHT
         // this.callback();
      });
   }

   getBaseData(data, profInfo) {
      let profInfoJSON = JSON.parse(profInfo);
      // idk about this being here
      this.username = profInfoJSON.profile.name.full_name;

      data.name = this.username;
      data.joined = profInfoJSON.profile.registration_timestamp * 1000;
      // TODO: need a way to safely access all these variables
      // a function in the baseAnalyzer that will return unknown if it can't
      // find the given json attribute
      data.birthday = new Date(
         profInfoJSON.profile.birthday.year,
         profInfoJSON.profile.birthday.month,
         profInfoJSON.profile.birthday.day
      );

      // NOPE
      this.callback();
   }

   setCurrentCallback(callback) {
      this.callback = callback;
   }

   analyzeMsgThreads(msgData, callback) {
      var msgDirs = this.getDirChildren('messages/inbox');
      this.setCurrentCallback(callback)

      // regular attempt
      var numDirs = msgDirs.length;
      this.progress = new LoadBar(numDirs);
      this.progress.show();
      
      // DEBUG
      console.log(numDirs);

      // loop through msg threads
      msgDirs.map((msgDir) => {
         var msgThread = msgDir.getChildByName("message_1.json");

         // message thread was not found in the given directory
         if (!msgThread) {
            this.progress.updatePercentage(); 
            return;
         }

         msgThread.getText(this.analyzeMessageThread.bind(this, msgDir.name, msgData));
      });
   }

   analyzeMessageThread(threadName, msgData, msg) {
      // console.log(msg);
      let msgJSON = JSON.parse(msg);
      let participants = msgJSON.participants // all participants in the current chat thread
      let group = true;                         // remains true if the chat is a groupchat

      if (participants && participants.length > 2) {
         msgData.groupChatThreads.push(threadName);
      }
      else if(participants) {
         let participantStat = {
            'dirName': threadName,
            'msgByUser': 0,
            'other': 0
         };
         msgData.regThreads[participants[0].name] = participantStat; 
         group = false;
      }

      if (msgJSON.messages && msgJSON.messages.length > 1) {
         // pull this function out and make sure you can reuse it in individual thread analysis
         msgJSON.messages.reduce(function(acc, msg) {
            if (!group) {
               if (msg.sender_name == this.username) {
                  acc.regThreads[participants[0].name].msgByUser++; 
               }
               else
               {
                  acc.regThreads[participants[0].name].other++; 
               }
            }

            if (msg.sender_name == this.username) {
               let d = new Date(msg.timestamp_ms);
               let y = d.getFullYear(); // message years
               acc.timeStats.hourly.sent[d.getHours()]++;
               acc.timeStats.weekly.sent[d.getDay()]++;
               acc.timeStats.monthly.sent[d.getMonth()]++;
               if (acc.timeStats.yearly[y]) {
                  acc.timeStats.yearly[y].sent++;
               }
               else {
                  acc.timeStats.yearly[y] = {
                     'sent': 0,
                     'received': 0
                  }
               }
            }
            else if (msg.sender_name == participants[0].name) {
               let d = new Date(msg.timestamp_ms);
               let y = d.getFullYear(); // message years
               acc.timeStats.hourly.received[d.getHours()]++;
               acc.timeStats.weekly.received[d.getDay()]++;
               acc.timeStats.monthly.received[d.getMonth()]++;
               if (acc.timeStats.yearly[y]) {
                  acc.timeStats.yearly[y].received++;
               }
               else {
                  acc.timeStats.yearly[y] = {
                     'sent': 0,
                     'received': 0
                  }
               }
            }

            return acc;
         }.bind(this), msgData);
      }

      // progress bar
      this.progress.updatePercentage(); 

      // triggers callback once all msgThreads are analyzed
      if (this.progress.current == this.progress.max) {
         this.progress.hide();
         this.progress = null;
         this.callback();
      }
   }
}

export { FBAnalyzer };
