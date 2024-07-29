"use client";

import { Button, Container, Flex, Heading, Link } from "@radix-ui/themes";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <Container
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Flex
                justify={"center"}
                align={"center"}
                direction={"column"}
                gap={"2"}
            >
                <Heading size="9">
                    sorry, i just shit my pants: {error.message}
                </Heading>
                <Button asChild>
                    <Link href="/">
                        go back to home (like your father never could)
                    </Link>
                </Button>
            </Flex>
        </Container>
    );
}
