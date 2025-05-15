import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string().min(10, {message: "Content must atleast of 10 letters"}).max(300, {message: "Can't be longer than 300 letters"})
})