"use server";

import {
    AlertDialog,
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
import Link from "next/link";

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
                                    <Flex gap="2">
                                        <Button
                                            mt="4"
                                            mb="1"
                                            variant="surface"
                                            color="blue"
                                        >
                                            <Link
                                                href={`/map/${map.quaver_id}`}
                                                target="_blank"
                                            >
                                                View
                                            </Link>
                                        </Button>
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
                                                    Map: {mapQua.title}
                                                </Dialog.Title>
                                                <Dialog.Description>
                                                    Difficulty:{" "}
                                                    {mapQua.difficulty_name}
                                                </Dialog.Description>
                                            </Dialog.Content>
                                        </Dialog.Root>
                                        <AlertDialog.Root>
                                            <AlertDialog.Trigger>
                                                <Button
                                                    mt="4"
                                                    mb="1"
                                                    variant="surface"
                                                    color="red"
                                                >
                                                    Delete
                                                </Button>
                                            </AlertDialog.Trigger>
                                            <AlertDialog.Content>
                                                <AlertDialog.Title>
                                                    Are you sure you'd like to
                                                    delete this map?
                                                </AlertDialog.Title>
                                                <AlertDialog.Description>
                                                    This will delete all
                                                    associated ratings and
                                                    scores.
                                                </AlertDialog.Description>
                                                <Flex
                                                    justify={"end"}
                                                    gap="2"
                                                    mt="4"
                                                >
                                                    <AlertDialog.Cancel>
                                                        <Button
                                                            color="gray"
                                                            variant="surface"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </AlertDialog.Cancel>
                                                    <AlertDialog.Action>
                                                        <Button color="red">
                                                            Delete
                                                        </Button>
                                                    </AlertDialog.Action>
                                                </Flex>
                                            </AlertDialog.Content>
                                        </AlertDialog.Root>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Box>
                    );
                })}
            </Grid>
        </Container>
    );
}
