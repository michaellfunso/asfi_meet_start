const { db } = require("../../routes/db.config");

const deleteAdmin = async (req, res) => {
    try {
        const {Id} = req.body;

        db.query("DELETE FROM admin_accounts WHERE id = ?", [Id], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                console.log(result)
                return res.status(404).json({ error: "Admin not found" });
            }else{
                return res.json({success:"Admin Deleted Successfully", message: "Admin deleted successfully" });

            }

        }
        );

    
    } catch (error) {
        console.log(error)
       return res.status(500).json({ error: error.message });
    }
    }

    module.exports = deleteAdmin