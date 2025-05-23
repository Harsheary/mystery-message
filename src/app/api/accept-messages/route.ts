import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user; //type User from next-auth

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await req.json(); //this will be coming from frontend

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user statis to accept messages",
        },
        {
          status: 401,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully",
          updatedUser,
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.error(`Failed to update user status to accept messages`, error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user; //type User from next-auth

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId)
  
    if (!foundUser) {
      return Response.json(
          {
            success: false,
            message: "User not found"
            
          },
          {
            status: 404,
          }
        );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage
        
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed to get user status for accepting messages`, error);
    return Response.json(
      {
        success: false,
        message: "Error in getting message accepting status",
      },
      {
        status: 500,
      }
    );
  }
}
