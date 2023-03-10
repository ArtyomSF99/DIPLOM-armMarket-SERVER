const db = require('../db')
const bcryptjs = require('bcryptjs')
const authService = require('../service/auth_service')
const cookieParser = require('cookie-parser')
const { validationResult, cookie } = require('express-validator')

class AuthController {
    async registration (req, res, next) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.json({message:"Ошибка при регистрации", errors})
            }
            const {login, password, first_name, last_name, email, phone, region, account_create_date} = req.body
            const userData = await authService.registration(login, password, first_name,last_name, email, phone, region, account_create_date)
            res.cookie('refreshToken', userData.refreshToken, {maxAge:60* 24*60*60*1000, httpOnly:true, sameSite:'None', secure:true})
            return res.json(userData)

        } catch(e) {
             next(e)
        }
    }
    async login (req, res, next) {
        try{
            const {login, password} = req.body
            const userData = await authService.login(login, password)
            //res.setHeader('Set-Cookie', `${user.Data.refreshToken}; HttpOnly; Max-Age=30* 24*60*60*1000`);
            res.cookie('refreshToken', userData.refreshToken, {maxAge:60* 24*60*60*1000, httpOnly:true,sameSite:'None', secure:true})
            res.json(userData)
            
        }
        catch (e){
           next(e)
        }
    }

    async active (req, res, next) {
        try{
            const activationLink = req.params.link;
            await authService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        }
        catch (e){
            next(e)
        }
    }
    async logout (req, res, next) {
        try{
            const{refreshToken} = req.cookies;
        
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json('Вы вышли')
        }
        catch (e){
            next(e)
        }
    }

    async refresh (req, res, next) {
        try{
            const {refreshToken} = req.cookies
            console.log(refreshToken)
            const userData = await authService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge:60* 24*60*60*1000, httpOnly:true,sameSite:'None', secure:true})
            return res.json(userData)

        }
        catch (e){
            next(e)
        }
    }
    async getUsers( req, res, next){
        try{
            const users = await db.query(`SELECT * FROM users`)
            console.log(users.rows)
            res.json(users.rows)
        }
        catch(e){

        }
    }
   
}

module.exports = new AuthController()
