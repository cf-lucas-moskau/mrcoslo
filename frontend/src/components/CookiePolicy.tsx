import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const CookiePolicy: React.FC = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="blue.700">
            Cookie-Richtlinie
          </Heading>

          <Text mb={4}>
            Zuletzt aktualisiert: {new Date().toLocaleDateString()}
          </Text>

          <Text mb={6}>
            Diese Cookie-Richtlinie erklärt, wie MRCO Oslo ("wir", "uns" oder
            "unser") Cookies und ähnliche Technologien verwendet, um Sie zu
            erkennen, wenn Sie unsere Website und mobile Anwendung (zusammen die
            "Dienste") besuchen. Es erklärt, was diese Technologien sind und
            warum wir sie verwenden, sowie Ihre Rechte, unsere Verwendung von
            ihnen zu kontrollieren.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            1. Was sind Cookies?
          </Heading>

          <Text mb={6}>
            Cookies sind kleine Datendateien, die auf Ihrem Computer oder
            mobilen Gerät platziert werden, wenn Sie eine Website besuchen.
            Cookies werden weithin verwendet, um Websites funktionieren zu
            lassen oder effizienter zu arbeiten, sowie um Informationen
            bereitzustellen.
          </Text>

          <Text mb={6}>
            Cookies werden von dem Webserver gesetzt, der die besuchte Website
            betreibt, auf Ihrem Webbrowser. Die Inhalte der Cookies können dann
            nur von dem Webserver abgerufen oder gelesen werden, der den Cookie
            gesetzt hat.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            2. Warum verwenden wir Cookies?
          </Heading>

          <Text mb={4}>
            Wir verwenden Cookies für verschiedene Zwecke, darunter:
          </Text>

          <UnorderedList mb={6} pl={6}>
            <ListItem>
              <Text fontWeight="bold">Authentifizierung</Text>
              <Text>
                Wir verwenden Cookies, um Sie zu identifizieren, wenn Sie sich
                bei unseren Diensten anmelden. Dies ermöglicht es Ihnen, zu
                Ihrem Konto zuzukehren, ohne sich jedes Mal erneut anzumelden,
                wenn Sie unsere Dienste besuchen.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Sicherheit</Text>
              <Text>
                Wir verwenden Cookies, um die Sicherheit unserer Dienste zu
                unterstützen und verdächtige Aktivitäten oder Verstöße gegen
                unsere Nutzungsbedingungen zu erkennen.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Präferenzen und Funktionalität</Text>
              <Text>
                Wir verwenden Cookies, um Ihre Einstellungen und Präferenzen zu
                speichern, wie z.B. Sprache und Standort, sowie
                benutzerdefinierte Funktionen.
              </Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Analyse und Leistung</Text>
              <Text>
                Wir verwenden Cookies, um Informationen darüber zu sammeln, wie
                unsere Dienste genutzt werden, um unsere Dienste zu verbessern
                und zu optimieren.
              </Text>
            </ListItem>
          </UnorderedList>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            3. Von uns verwendete Cookies
          </Heading>

          <Text mb={4}>
            Wir verwenden sowohl Erst- als auch Drittanbieter-Cookies für
            mehrere Zwecke. Zu den von uns verwendeten Cookies gehören:
          </Text>

          <Table mb={6} variant="simple">
            <Thead>
              <Tr>
                <Th>Name des Cookies</Th>
                <Th>Zweck</Th>
                <Th>Ablaufzeit</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>auth_session</Td>
                <Td>
                  Zur Authentifizierung und Aufrechterhaltung Ihrer Sitzung
                </Td>
                <Td>7 Tage</Td>
              </Tr>
              <Tr>
                <Td>fb_login_state</Td>
                <Td>Zur Verwaltung der Facebook-Anmeldung</Td>
                <Td>Session</Td>
              </Tr>
              <Tr>
                <Td>_ga (Google Analytics)</Td>
                <Td>Zur Unterscheidung von Benutzern für Analysezwecke</Td>
                <Td>2 Jahre</Td>
              </Tr>
              <Tr>
                <Td>_gid (Google Analytics)</Td>
                <Td>Zur Unterscheidung von Benutzern für Analysezwecke</Td>
                <Td>24 Stunden</Td>
              </Tr>
              <Tr>
                <Td>user_preferences</Td>
                <Td>
                  Speichert Benutzereinstellungen wie Sprache und
                  Anzeigeoptionen
                </Td>
                <Td>1 Jahr</Td>
              </Tr>
            </Tbody>
          </Table>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            4. Cookies von Drittanbietern
          </Heading>

          <Text mb={4}>
            Einige Cookies, die in unseren Diensten platziert werden, werden von
            Drittanbietern bereitgestellt, wie zum Beispiel Facebook und Google
            Analytics. Diese Drittanbieter können Ihre persönlichen
            Informationen sammeln und verfolgen. Diese Cookies unterliegen den
            jeweiligen Datenschutzrichtlinien dieser Drittanbieter.
          </Text>

          <Text mb={6}>
            Durch die Nutzung unserer Dienste erklären Sie sich mit der
            Platzierung von Drittanbieter-Cookies auf Ihrem Gerät einverstanden,
            wie in dieser Cookie-Richtlinie beschrieben.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            5. Kontrolle von Cookies
          </Heading>

          <Text mb={4}>
            Die meisten Web-Browser erlauben eine gewisse Kontrolle der meisten
            Cookies durch die Browsereinstellungen. Sie können Ihre Browser so
            einstellen, dass sie alle Cookies ablehnen oder anzeigen, wenn ein
            Cookie gesendet wird. Bitte beachten Sie jedoch, dass einige
            Funktionen unserer Dienste möglicherweise nicht ordnungsgemäß
            funktionieren, wenn Sie Cookies deaktivieren.
          </Text>

          <Text mb={6}>
            Um mehr über Cookies zu erfahren, besuchen Sie bitte
            www.allaboutcookies.org, wo Sie weitere Informationen über Cookies
            erhalten und wie Sie diese in Ihrem Browser verwalten können.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            6. Änderungen an dieser Cookie-Richtlinie
          </Heading>

          <Text mb={6}>
            Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren.
            Wir werden Sie über Änderungen informieren, indem wir die neue
            Cookie-Richtlinie auf dieser Seite veröffentlichen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            7. Kontakt
          </Heading>

          <Text mb={4}>
            Wenn Sie Fragen zu unserer Verwendung von Cookies oder anderen
            Technologien haben, kontaktieren Sie uns bitte:
          </Text>

          <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
            <Text>Per E-Mail: info@mrcoslo.com</Text>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default CookiePolicy;
