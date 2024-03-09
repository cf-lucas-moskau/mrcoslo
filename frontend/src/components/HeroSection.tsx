import { Box, Heading, Text } from "@chakra-ui/react";

const HeroSection: React.FC = () => {
  return (
    <Box
      id="us"
      p={8}
      textAlign="center"
      alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Heading mb={4} size="2xl" fontWeight="bold" maxW={"1000px"}>
        Mikkeller Running Club Oslo
      </Heading>
      <Text fontSize="lg" maxW={"800px"} textAlign={"center"}>
        The idea of Mikkeller Running Club is to stay fit through running. That
        makes us capable of enjoying even more of the good life – which includes
        state of the art food and drinks. <br /> <br />
        Obviously our main passion is beer – especially drinking beers – and
        sometimes (preferably) in large scales.
        <br />
        <br /> The club is founded by Mikkel Borg Bjergsø, who is also the
        creator and owner of Mikkeller. <br />
        <br /> Speed is not the main target in Mikkeller Running Club. Having
        fun and great social relations is our top priority and we're just proud
        to see MRC members take part in races and events around the world.
        <br />
        <br /> You do not have to be an experienced runner or athlete to join
        MRC…all we ask is for you to come join us and have fun staying healthy –
        and sometimes a bit tipsy!!! <br />
        <br />
        We hope to see you wear the shirt around the world….
      </Text>
    </Box>
  );
};

export default HeroSection;
