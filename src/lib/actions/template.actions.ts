"use server";

import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  databases,
  users,
  TEMPLATE_COLLECTION_ID,
  account,
} from "../apppwrite.config";
import { parseStringify } from "../utils";
import { Template } from "@/types/appwrite.types";

declare interface CreateUserParams {
  name?: string;
  email: string;
  password: string;
}

// CREATE(signup) APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    console.log({ newuser });

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// LOGIN USER
export const loginUser = async (user: CreateUserParams) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    console.log({ session });

    return parseStringify(session);
  } catch (error) {
    console.error("An error occurred while login the user:", error);
    throw error;
  }
};

// CREATE TEMPLATE
export const createTemplate = async ({ ...templateDetails }: Template) => {
  try {
    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newTemplate = await databases.createDocument(
      DATABASE_ID!,
      TEMPLATE_COLLECTION_ID!,
      ID.unique(),
      {
        ...templateDetails,
      }
    );

    console.log({ newTemplate });

    return parseStringify(newTemplate);
  } catch (error) {
    console.error("An error occurred while creating a new template:", error);
  }
};

// GET TEMPLATE
export const getTemplates = async (userId?: string) => {
  try {
    const templates = await databases.listDocuments(
      DATABASE_ID!,
      TEMPLATE_COLLECTION_ID!,
      // userId ? [Query.equal("userId", [userId])] : undefined
    );

    console.log({ templates });

    return parseStringify(templates.documents);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// associate template with user
// give checkbox for only your template and all templtes
