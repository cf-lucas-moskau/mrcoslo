import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  OrderedList,
  Divider,
} from "@chakra-ui/react";

const TermsOfUse: React.FC = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="blue.700">
            Nutzungsbedingungen
          </Heading>

          <Text mb={4}>
            Zuletzt aktualisiert: {new Date().toLocaleDateString()}
          </Text>

          <Text mb={6}>
            Willkommen bei MRC Oslo. Diese Nutzungsbedingungen regeln Ihre
            Nutzung unserer Website und mobilen Anwendung (zusammen die
            "Dienste"). Bitte lesen Sie diese Bedingungen sorgfältig durch,
            bevor Sie auf unsere Dienste zugreifen oder sie nutzen.
          </Text>

          <Text mb={6}>
            Durch den Zugriff auf oder die Nutzung der Dienste von MRCO Oslo
            erklären Sie sich mit diesen Nutzungsbedingungen einverstanden und
            stimmen zu, an sie gebunden zu sein. Wenn Sie mit diesen Bedingungen
            nicht einverstanden sind, dürfen Sie unsere Dienste nicht nutzen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            1. Nutzerkonto
          </Heading>

          <Text mb={4}>
            Wenn Sie ein Konto bei unseren Diensten erstellen, müssen Sie uns
            genaue, vollständige und aktuelle Informationen zur Verfügung
            stellen. Die Nichteinhaltung dieser Anforderung stellt eine
            Verletzung der Nutzungsbedingungen dar, die zur sofortigen
            Beendigung Ihres Kontos führen kann.
          </Text>

          <Text mb={4}>
            Sie sind verantwortlich für die Geheimhaltung Ihres Passworts und
            für alle Aktivitäten, die unter Ihrem Konto stattfinden. Sie
            erklären sich damit einverstanden, uns umgehend über jede unbefugte
            Nutzung Ihres Kontos zu informieren.
          </Text>

          <Text mb={6}>
            Wir behalten uns das Recht vor, ein Konto jederzeit und ohne
            Vorankündigung zu schließen, wenn wir der Meinung sind, dass dies
            notwendig ist.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            2. Nutzung unserer Dienste
          </Heading>

          <Text mb={4}>
            Die Nutzung unserer Dienste kann folgende Aktivitäten umfassen:
          </Text>

          <UnorderedList mb={4} pl={6}>
            <ListItem>
              Anmeldung für Laufveranstaltungen und Staffelläufe
            </ListItem>
            <ListItem>Teilnahme an Gruppenaktivitäten</ListItem>
            <ListItem>Kommunikation mit anderen Nutzern</ListItem>
            <ListItem>Hochladen von Inhalten und Fotos</ListItem>
          </UnorderedList>

          <Text mb={6}>
            Bei der Nutzung unserer Dienste müssen Sie alle anwendbaren Gesetze
            und Vorschriften einhalten. Es ist Ihnen untersagt, unsere Dienste
            für illegale oder nicht autorisierte Zwecke zu nutzen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            3. Facebook-Anmeldung
          </Heading>

          <Text mb={4}>
            Unsere Anwendung bietet die Möglichkeit, sich über Ihren
            Facebook-Account anzumelden. Wenn Sie sich für diese Option
            entscheiden, gelten zusätzlich folgende Bedingungen:
          </Text>

          <OrderedList mb={4} pl={6}>
            <ListItem>
              Sie müssen die Nutzungsbedingungen von Facebook einhalten.
            </ListItem>
            <ListItem>
              Wir haben Zugriff auf grundlegende Informationen aus Ihrem
              Facebook-Profil wie Name, Profilbild und E-Mail-Adresse.
            </ListItem>
            <ListItem>
              Wir werden keine Inhalte ohne Ihre ausdrückliche Zustimmung in
              Ihrem Namen auf Facebook veröffentlichen.
            </ListItem>
          </OrderedList>

          <Text mb={6}>
            Falls Sie Ihre Facebook-Verknüpfung entfernen möchten, können Sie
            dies in Ihren Kontoeinstellungen tun.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            4. Geistiges Eigentum
          </Heading>

          <Text mb={6}>
            Die Dienste und ihre ursprünglichen Inhalte (mit Ausnahme von
            nutzergenerierten Inhalten) gehören MRCO Oslo und sind durch
            Urheberrechte, Marken und andere geistige Eigentumsrechte geschützt.
            Unsere Marken und Branding dürfen ohne vorherige schriftliche
            Genehmigung von MRCO Oslo nicht verwendet werden.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            5. Nutzergenerierte Inhalte
          </Heading>

          <Text mb={4}>
            Durch das Hochladen von Inhalten auf unsere Dienste gewähren Sie uns
            eine weltweite, nicht-exklusive, gebührenfreie Lizenz zur Nutzung,
            Reproduktion, Verarbeitung und Veröffentlichung dieser Inhalte in
            Verbindung mit der Bereitstellung unserer Dienste.
          </Text>

          <Text mb={6}>
            Sie sind verantwortlich für alle Inhalte, die Sie hochladen, und
            müssen sicherstellen, dass Sie alle Rechte an diesen Inhalten
            besitzen oder über entsprechende Genehmigungen verfügen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            6. Haftungsausschluss
          </Heading>

          <Text mb={6}>
            Unsere Dienste werden "wie gesehen" und "wie verfügbar" angeboten.
            MRCO Oslo und seine Lieferanten und Partner übernehmen keine
            ausdrücklichen oder stillschweigenden Garantien oder Bedingungen
            jeglicher Art, einschließlich, aber nicht beschränkt auf Garantien
            oder Bedingungen der Marktgängigkeit, Eignung für einen bestimmten
            Zweck oder Nichtverletzung der Rechte Dritter.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            7. Haftungsbeschränkung
          </Heading>

          <Text mb={6}>
            MRCO Oslo, seine Partner, leitenden Angestellten, Direktoren,
            Mitarbeiter und Agenten haften nicht für indirekte, zufällige,
            besondere, Folge- oder exemplarische Schäden, einschließlich, aber
            nicht beschränkt auf Schäden für entgangenen Gewinn, Firmenwert,
            Nutzung, Daten oder andere immaterielle Verluste, die sich aus oder
            im Zusammenhang mit Ihrer Nutzung oder Unfähigkeit zur Nutzung der
            Dienste ergeben.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            8. Änderungen
          </Heading>

          <Text mb={6}>
            Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit
            zu ändern oder zu ersetzen. Die aktualisierte Version wird auf
            dieser Seite veröffentlicht und tritt sofort in Kraft. Es liegt in
            Ihrer Verantwortung, diese Nutzungsbedingungen regelmäßig auf
            Änderungen zu überprüfen.
          </Text>

          <Divider my={6} />

          <Heading as="h2" size="lg" mb={4} color="blue.700">
            9. Kontakt
          </Heading>

          <Text mb={4}>
            Wenn Sie Fragen zu diesen Nutzungsbedingungen haben, kontaktieren
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

export default TermsOfUse;
