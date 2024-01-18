import { NextResponse } from "next/server";

let contractsList = ["contract1","contract2"]

export async function GET(request : Request, response : Response) {
    // return new Response('contractsList')
    return NextResponse.json(contractsList)

}
