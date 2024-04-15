const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },
   description: {
    type: String,
    trim: true,
    match: [/^[A-Za-z0-9\s_.,'";]*/, 'description may only contain letters, numbers, and punctuation'],
   },
   duration: {
    type: Number,
    min: 0,
    max: 720,
    required: true
   },
   reps: {
    type: Number,
    min: 0,
    max: 50
   },
   moves: [{
      move: {
         type: String,
         trim: true,
         match: [/^[A-Za-z\s]*${3-20}/],
         required: true,
      },
      repeated: {
         type: Number,
         min: 2,
         max: 250,
      },
      duration: {
         type: Number,
         min: 10,
         max: 3600
      }
   }],
   date: {
    type: String,
    default: new Date(8.64e15).toString(),
   },
});

exerciseSchema.methods.pushIntoMoves = (...args) => {
   try {
      this.moves.push(...args);
      this.save();
      console.log(`new moves successfully added to exercise: ${this.moves}`);
   }
   catch(error){
      console.error(error);
   }
}

module.exports = mongoose.model('Excerise', exerciseSchema);