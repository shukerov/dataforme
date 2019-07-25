export class CallbackLoop {
   constructor(name, finalCallback, numCallbacks) {
      this.name = name;
      this.callbackLoopCount = 0;

      if (numCallbacks) {
         this.callbackLoopCount = numCallbacks;
      }

      this.callback = finalCallback

      // DEBUG
      // console.log(`Init ${this.name}: 
      //    callback cnt: ${this.callbackLoopCount},
      //    callback fn: ${this.callback.toString()}
      // `);
   }

   setLoopCount(n=1) {
      if (n > 1) {
         this.callbackLoopCount = n
      }
      else {
         this.callbackLoopCount += 1;
      }
      // DEBUG
      // console.log(`${this.name}: callback cnt is now ${this.callbackLoopCount}`);
   }

   call() {
      this.callbackLoopCount -= 1;
      // DEBUG
      // console.log(`${this.name}: ${this.callbackLoopCount} till MAGIC`);

      if (this.callbackLoopCount == 0) {
         // DEBUG
         // console.log(`${this.name}: **MAGIC HAPPENED**`);

         this.callback();
      }
   }
}
