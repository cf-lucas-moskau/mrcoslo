import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Link,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
} from "@chakra-ui/react";

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="blue.700">
            Datenschutzrichtlinie
          </Heading>

          <Text mb={4}>
            Zuletzt aktualisiert: {new Date().toLocaleDateString()}
          </Text>

          <Text mb={6}>
            Diese Datenschutzrichtlinie beschreibt, wie MRCO Oslo ("wir", "uns"
            oder "unser") personenbezogene Daten sammelt, verwendet und
            offenlegt, wenn Sie unsere Website und mobile Anwendung (zusammen
            die "Dienste") nutzen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            1. Erhobene Informationen
          </Heading>

          <Text mb={4}>
            Wir sammeln verschiedene Arten von Informationen für verschiedene
            Zwecke, um Ihnen unsere Dienste zur Verfügung zu stellen und zu
            verbessern.
          </Text>

          <Heading as="h3" size="md" mb={3}>
            1.1 Persönliche Daten
          </Heading>

          <Text mb={4}>
            Während der Nutzung unserer Dienste können wir Sie bitten, uns
            bestimmte persönlich identifizierbare Informationen zur Verfügung zu
            stellen, die verwendet werden können, um Sie zu kontaktieren oder zu
            identifizieren ("Persönliche Daten"). Persönlich identifizierbare
            Informationen können umfassen, sind aber nicht beschränkt auf:
          </Text>

          <UnorderedList mb={4} pl={6}>
            <ListItem>Name</ListItem>
            <ListItem>E-Mail-Adresse</ListItem>
            <ListItem>
              Facebook Profil-Informationen (bei Anmeldung mit Facebook)
            </ListItem>
            <ListItem>Profilbild</ListItem>
          </UnorderedList>

          <Heading as="h3" size="md" mb={3}>
            1.2 Nutzungsdaten
          </Heading>

          <Text mb={6}>
            Wir können auch Informationen sammeln, die Ihr Browser sendet, wenn
            Sie unsere Dienste besuchen oder wenn Sie auf die Dienste über ein
            mobiles Gerät zugreifen ("Nutzungsdaten").
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            2. Verwendung der Daten
          </Heading>

          <Text mb={4}>
            MRC Oslo verwendet die gesammelten Daten für verschiedene Zwecke:
          </Text>

          <UnorderedList mb={6} pl={6}>
            <ListItem>
              Um unsere Dienste bereitzustellen und zu verwalten
            </ListItem>
            <ListItem>
              Um Sie über Änderungen unserer Dienste zu informieren
            </ListItem>
            <ListItem>
              Um Ihnen die Teilnahme an interaktiven Funktionen unserer Dienste
              zu ermöglichen
            </ListItem>
            <ListItem>Um kundenservice zu bieten</ListItem>
            <ListItem>
              Um Analysen und Nutzungsdaten zu sammeln, damit wir unsere Dienste
              verbessern können
            </ListItem>
            <ListItem>Um Ihre Erfahrung zu personalisieren</ListItem>
          </UnorderedList>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            3. Facebook-Anmeldung
          </Heading>

          <Text mb={4}>
            Unsere Anwendung verwendet Facebook Login, um Ihnen eine bequeme
            Anmeldeoption zu bieten. Wenn Sie sich für die Anmeldung über
            Facebook entscheiden, erhalten wir Zugriff auf grundlegende
            Profilinformationen von Ihrem Facebook-Konto, wie zum Beispiel:
          </Text>

          <UnorderedList mb={4} pl={6}>
            <ListItem>Name</ListItem>
            <ListItem>Profilbild</ListItem>
            <ListItem>E-Mail-Adresse</ListItem>
          </UnorderedList>

          <Text mb={6}>
            Wir verwenden diese Informationen nur zum Zweck der
            Benutzerauthentifizierung und zur Personalisierung Ihres Erlebnisses
            in unserer Anwendung. Wir veröffentlichen nichts in Ihrem Namen auf
            Facebook ohne Ihre ausdrückliche Zustimmung.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            4. Datensicherheit
          </Heading>

          <Text mb={6}>
            Die Sicherheit Ihrer Daten ist uns wichtig, aber denken Sie daran,
            dass keine Methode der Übertragung über das Internet oder Methode
            der elektronischen Speicherung 100% sicher ist. Während wir uns
            bemühen, kommerziell akzeptable Mittel zum Schutz Ihrer persönlichen
            Daten zu verwenden, können wir ihre absolute Sicherheit nicht
            garantieren.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            5. Änderungen dieser Datenschutzrichtlinie
          </Heading>

          <Text mb={6}>
            Wir können unsere Datenschutzrichtlinie von Zeit zu Zeit
            aktualisieren. Wir werden Sie über Änderungen informieren, indem wir
            die neue Datenschutzrichtlinie auf dieser Seite veröffentlichen. Es
            wird empfohlen, diese Datenschutzrichtlinie regelmäßig auf
            Änderungen zu überprüfen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            6. Kontakt
          </Heading>

          <Text mb={4}>
            Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, kontaktieren
            Sie uns bitte:
          </Text>

          <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
            <Text>Per E-Mail: info@mrcoslo.com</Text>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default PrivacyPolicy;
