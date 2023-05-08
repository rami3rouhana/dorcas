import mysql from 'mysql';

export const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tabitha_attendance"
})

const connectDatabase = () => {

    // Connecting to database
    connection.connect(function (err) {
        if (err) {
            console.log("Error in the connection")
            console.log(err)
        }
        else {
            console.log(`Database Connected`)
        }
    })
}


export default connectDatabase;