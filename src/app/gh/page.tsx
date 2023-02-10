import { redirect } from "next/navigation";

export default ({
    searchParams: {
        state, // the redirect URL, 'state' is the catch-all query param by the GitHub App API
        code
    }
}) => {
    redirect(`${state}?code=${code}`)
}