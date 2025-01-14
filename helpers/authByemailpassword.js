import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db_schema.cjs';


async function authByEmailPassword(email, password){
    const { User } = db;

    const user = await User.findOne({where: {"email": email}});

    if(!user) return null;

    if(await bcrypt.compare(password, user["password"])) return user["uuid"];
}

export default authByEmailPassword;