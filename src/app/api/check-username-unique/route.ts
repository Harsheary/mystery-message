import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: NextRequest) {

  await dbConnect();

  //localhost:3000/api/something?username=harsh?age=20?hero=true    this way we are getting the url first and then getting the username from it

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(`result`, result);

    if (!result.success) {
      const usernameErrors = result.error.format()?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

    if (existingVerifiedUser) {
        return Response.json(
            {
              success: false,
              message:
                "Username is already taken",
            },
            {
              status: 400,
            }
          );
    }

    return Response.json(
        {
          success: true,
          message:
            "Available",
        },
        {
          status: 201,
        }
      );

  } catch (error) {
    console.error(`error checking username`, error);

    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
