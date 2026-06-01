

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { IRauth } from "./auth.interface";
import { pool } from "../../db";
import config from "../../config";

const auth_registar_DB = async (payload: IRauth) => {

    const { name, email, password, role } = payload;


    const hashpassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        
        INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
        `, [name, email, hashpassword, role]);

    delete result.rows[0].password;

    return result;
}


const auth_login_DB = async (payload: { email: string, password: string }) => {

    const { email, password } = payload;


    const users_DB = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])

    if (users_DB.rows.length === 0) {
        throw new Error("Invalid Credentails")
    }


    const users_DB_row = users_DB.rows[0];


    const password_check =await bcrypt.compare(password, users_DB_row.password)

    if (!password_check) {
        throw new Error("password dont match")
    }

    



    const jwtpayload = {
        id: users_DB_row.id,
        name: users_DB_row.name,
        role: users_DB_row.role,
        email:users_DB_row.email
    }

    const token = jwt.sign(jwtpayload, config.secret_token as string, { expiresIn: "1d" })

    delete users_DB_row.password

    const user= users_DB_row

    return {token,user}

}


export const authService = {
    auth_registar_DB,
    auth_login_DB
}