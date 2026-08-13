import { z } from 'zod'
export const packCreateDtoSchema = z.object({
  name:z.string().min(1,'name must have at least 3 characters long').max(100,'Name cannot be more than 100 characters.'),
  description:z.string().max(100,'Description cannot be more than 100 characters.'),
  isPublic:z.boolean(),
})
export const TagSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(50)
});
export type Tag = z.output<typeof TagSchema>
export interface Pack{
  id:number,
  name:string,
  description:string|null
  isPublic:boolean
  tags:z.output<typeof TagSchema>[]
  authorId:number
}
export interface UsersPack extends Pack{
  lastRepeat?:Date
}
export const packEditDtoSchema= z.object({
    id:z.number(),
    name:z.string().min(1,'name must have at least 3 characters long').max(100,'Name cannot be more than 100 characters.'),
    description:z.string().max(100,'Description cannot be more than 100 characters.'),
    isPublic:z.boolean(),
    addedTags:z.array(TagSchema).default([]),
    deletedTags:z.array(z.number()).default([])
})
export const questCreateDtoSchema = z.object({
    quest:z.string().min(1,'Введите вопрос').max(500,'Вопрос не может быть длиннее 500 символов'),
    answer:z.string().min(1,'Введите ответ').max(500,'Ответ не может быть длиннее 500 символов'),
    hint:z.string().max(200,'Подсказка не может быть длиннее 200 символов').optional(),
    exampleInText:z.string().max(500,'Пример не может быть длиннее 500 символов').optional(),
    questImgName:z.string().max(255).optional(),
    answerImgName:z.string().max(255).optional(),
})
export const questEditDtoSchema = z.object({
    quest:z.string().min(1,'Введите вопрос').max(500,'Вопрос не может быть длиннее 500 символов'),
    answer:z.string().min(1,'Введите ответ').max(500,'Ответ не может быть длиннее 500 символов'),
    hint:z.string().max(200,'Подсказка не может быть длиннее 200 символов').optional(),
    exampleInText:z.string().max(500,'Пример не может быть длиннее 500 символов').optional(),
    removeQuestImage:z.boolean().optional(),
    removeAnswerImage:z.boolean().optional(),
})
export interface Quest{
    id:number,
    quest:string|null,
    answer:string|null,
    hint:string|null,
    exampleInText:string|null,
    questImgName:string|null,
    answerImgName:string|null,
    packId:number
}
export interface RepeatableQuest extends Quest{
    lastRepeated:Date|null,
    NextRepeated:Date|null,
    level:number|null,
    stage:number|null,
}