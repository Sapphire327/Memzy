import { z } from 'zod'
export const packCreateDtoSchema = z.object({
  name:z.string().min(1,'name must have at least 3 characters long').max(100,'Name cannot be more than 100 characters.'),
  description:z.string().max(100,'Description cannot be more than 100 characters.'),
  isPublic:z.boolean(),
})
export const TagSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(1).max(50)
});
export type Tag = z.output<typeof TagSchema>
export interface Pack{
  id:number,
  name:string,
  description:string|null
  isPublic:boolean
  tags:z.output<typeof TagSchema>[]
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