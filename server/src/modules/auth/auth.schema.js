import { z } from "zod";

export const registerShcema = z.object({
  username: z.string({ required_error: "الاسم مطلوب" }),
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(6, { message: "يجب أن تكون كلمة المرور على الأقل 6 أحرف" }),
});

export const loginShcema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(6, { message: "يجب أن تكون كلمة المرور على الأقل 6 أحرف" }),
});
