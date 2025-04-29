import { NextRequest, NextResponse } from "next/server";
import { fetchValidGuild } from "./utils/api";
const validateMiddlewareCookies = (req: NextRequest) => {
    const sessionID = req.cookies.get('connect.sid')?.value;
    return sessionID ? ({
        Cookie: `connect.sid=${sessionID}`
    }) : false;
}
export async function middleware(req: NextRequest) {
    console.log(req.nextUrl.pathname.split("/")[2]);
    const guildId = req.nextUrl.pathname.split("/")[2];
    const headers = validateMiddlewareCookies(req);
    if (!headers) return NextResponse.redirect(`${req.nextUrl.origin}/`);
    if (!guildId) return NextResponse.redirect(`${req.nextUrl.origin}/menu`);

    const response = await fetchValidGuild(guildId, headers);
    //maybe redirect to custom 404 page - otherwise might get rate limited from tugging on discord api too hard
    return response.status === 200 ? NextResponse.next() : NextResponse.redirect(`${req.nextUrl.origin}/`);
}

export const config = {
    matcher: ['/dashboard/:path*']
}