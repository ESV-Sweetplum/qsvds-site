import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import Link from "next/link";

export default function NotFound() {
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
                <Heading size="9">yo bitch</Heading>
                <Text>your shit wasn&apos;t found bruh</Text>
                <Button asChild>
                    <Link href="/">
                        go back to home (like your father never could)
                    </Link>
                </Button>
            </Flex>
        </Container>
    );
}
