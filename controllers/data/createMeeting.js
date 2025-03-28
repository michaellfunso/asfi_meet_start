
const { v4: uuidv4 } = require('uuid'); 
const { db } = require('../../routes/db.config');

const createMeeting = async (req,res) =>{
    try{
        const {title, time, isPrivate } = req.body
     
       // Function to capitalize each word and remove spaces
        const formatTitle = (str) => {
            return str
                .replace(/\s+/g, '') // Remove all white spaces
                .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
        };

        const rid = formatTitle(title);
        const secret = uuidv4();
     
        db.query("SELECT * FROM channels WHERE channel = ? ", [rid], async(err, data) =>{
            if(err){
                console.log(err)
            }
            if(data[0]){
                return res.json({success:"Meeting Already Exists"})
            }else{
                db.query("INSERT INTO channels SET ?", [{title:title, channel_secret:secret, channel:rid, time, privateMeeting:isPrivate}], async (err, inserted) =>{
                        if(err){
                            console.log(err)
                            return res.json({error:err})
                        }else{
            
                            return res.json({success:`Meeting Created Succesfully host:`, meetingId:inserted.insertId, channel:rid})
                        }
                    })
            }
        })
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = createMeeting