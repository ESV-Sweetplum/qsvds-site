"use server";

import {
    Box,
    Button,
    Card,
    Container,
    Dialog,
    Flex,
    Grid,
    Heading,
    Inset,
    Strong,
    Text,
} from "@radix-ui/themes";
import "../../styles/global.scss";
import { getUser, userIsAdmin } from "../actions";
import { redirect } from "next/navigation";
import prisma from "../../../prisma/initialize";
import MapQua from "@/interfaces/mapQua";
import { Textfit } from "react-textfit";

export default async function AdminPage() {
    const isAdmin = await userIsAdmin();
    if (!isAdmin) redirect("/");

    const maps = await prisma.map.findMany();

    return (
        <Container width="1200px" pt="70px">
            <Heading size="8" my="5">
                Admin
            </Heading>
            <Grid columns="3" gap="3" rows="repeat(auto, 64px)" width="auto">
                {maps.map((map, idx) => {
                    const mapQua = map.mapQua as unknown as MapQua;

                    return (
                        <Box maxWidth="360px" key={idx}>
                            <Card size="2">
                                <Inset
                                    clip="padding-box"
                                    side="top"
                                    pb="current"
                                >
                                    <img
                                        src={`https://cdn.quavergame.com/mapsets/${(map.mapQua as unknown as MapQua).mapset_id}.jpg`}
                                        alt={`${mapQua.title} image`}
                                        style={{
                                            display: "block",
                                            objectFit: "cover",
                                            width: "100%",
                                            height: 140,
                                            backgroundColor: "var(--gray-5)",
                                        }}
                                    />
                                </Inset>
                                <Flex direction={"column"}>
                                    <Text size="3">
                                        {mapQua.artist} - {mapQua.title}
                                    </Text>
                                    <Dialog.Root>
                                        <Dialog.Trigger>
                                            <Button
                                                mt="4"
                                                mb="1"
                                                variant="surface"
                                            >
                                                Edit
                                            </Button>
                                        </Dialog.Trigger>
                                        <Dialog.Content>
                                            <Dialog.Title>
                                                <Text size="7">
                                                    {mapQua.title}
                                                </Text>
                                            </Dialog.Title>
                                        </Dialog.Content>
                                    </Dialog.Root>
                                </Flex>
                            </Card>
                        </Box>
                    );
                })}
            </Grid>
        </Container>
    );
}
