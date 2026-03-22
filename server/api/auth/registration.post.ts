import { db, eq, tables } from '#server/database/utils/database'
import jwt from 'jsonwebtoken'
import z from 'zod/v4'
import ErrorHandler from '~~/server/utils/ErrorHandler'
const registrationSchema = z.object({
  email:z.email('Incorrect mail address'),
  name:z.string().min(3,'name must have at least 3 characters long'),
  password:z.string().min(8,'Password must have at least 8 characters long'),
})
export default defineEventHandler(async (event) => {
    try{
      const body = await readBody(event);
      const data = registrationSchema.parse(body)
      const findedUser = await db.query.users.findFirst({
        where: eq(tables.users.email,body.email ),
      });
      if(findedUser&&findedUser.hasActivated===true){
        throw createError({
            statusCode: 409,
            statusMessage: "Account with this email already exists",
            message:"Аккаунт с такой почтой уже зарегистрирован",
            data:[]
        });
      }else if (findedUser&&findedUser.hasActivated===false) {
        await db.delete(tables.users).where(eq(tables.users.email,data.email))
      }
      
      const hashedPassword = await hashPassword(data.password)
      const [user] = await db.insert(tables.users).values({
        email:data.email,
        name:data.name,
        passwordHash:hashedPassword,
      }).returning()
      if(!user)return;
      const domen = process.env.DOMEN || '';
      const secret = process.env.TOKEN_SECRET || 'fallback_secret';
       const token = jwt.sign({email:data.email}, secret, {
        expiresIn: '10m',
      });
      const { sendMail } = useNodeMailer()
      sendMail({ 
        subject: 'Регистрация на Memzy', 
        html:`
        <style>
          .button{
            max-width:250px;
            width:250px;
            text-align:center;
            text-decoration: none;
            display: block;
            font-size: 20px;
            border-radius: 6px;
            padding: 16px 6px;
            color: #205466;
            background-color: white;
            transition: background-color 0.3s ease;
          -webkit-transition: background-color 0.3s ease;
        }
        .button:hover{
          background-color:#D18183;
          color: white;
        }
        </style>
          <div style="padding:25px;border-radius:20px;background:linear-gradient(to right,#FAA89A,#FFC485);color:#205466">
            <h1 style="font-size:32px">Подтверждение почты</h1>
            <p style="font-size:24px">Ваша почта была указана при регистрации на сайте Memzy</p>
            <a class="button" href="${domen}/auth/confirmEmail?token=${token}">Подтвердить почту</a>
            <p >Ссылка действительна в течение 5 минут.</p>
            <p>Если вы не регистрировались на сайте, просто проигнорируйте это письмо.</p>
          </div>
        `,
        to: data.email 
      })
    return{success:true}
  }catch(e){
    ErrorHandler(e)
  }
})
