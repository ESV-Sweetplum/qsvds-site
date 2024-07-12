import GenerateHash from "@/lib/generateHash";

export async function GET() {
    return Response.json({ status: 200, hash: GenerateHash(369530) });
}
