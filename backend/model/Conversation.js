const mongoose=require("mongoose");
const conversationSchema=new mongoose.Schema({
    // we want to prevent the two diffrent conversatiuons with same user thats why using the groupTitle
    groupTitle:{
   type:String,
    },
members:{
type:Array,
},
lastMessage:{
    type:String,
},
lastMessageId:{
    type:String,
},


}, {timestamps:true})
module.exports=mongoose.model("Conversation", conversationSchema);