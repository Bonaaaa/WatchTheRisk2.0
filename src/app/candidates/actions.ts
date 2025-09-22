"use server";

import { revalidatePath } from "next/cache";
import { deleteCandidate } from "./service";

export async function handleDeleteCandidate(id: string) {
    const result = await deleteCandidate(id);
    if (result.success) {
        revalidatePath('/candidates');
    }
    return result;
}
