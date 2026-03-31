// Convex client setup
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

export const convex = new ConvexReactClient(convexUrl);

// Export useQuery and useMutation from convex/react
export { useQuery, useMutation } from "convex/react";
export { useAction } from "convex/react";
