import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";
import baseURL from "../assets/common/baseUrl";

const TABS = [
  { label: "Event Sentiment", key: "event" },
  { label: "Activity Sentiment", key: "activity" },
  { label: "Priest Sentiment", key: "priest" },
];

const chartColors = [
  "#FFA726",
  "#66BB6A",
  "#29B6F6",
  "#AB47BC",
  "#FF7043",
  "#26A69A",
  "#EC407A",
];

const SentimentReports = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [eventSentiment, setEventSentiments] = useState([]);
  const [activitySentiment, setActivitySentiments] = useState([]);
  const [priestSentiment, setPriestSentiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const [eventRes, activityRes, priestRes] = await Promise.all([
          axios.get(`${baseURL}/getAllEventSentiment`),
          axios.get(`${baseURL}/getAllActivitySentiment`),
          axios.get(`${baseURL}/getAllPriestSentiment`),
        ]);
        setEventSentiments(eventRes.data);
        setActivitySentiments(activityRes.data);
        setPriestSentiments(priestRes.data);
      } catch (err) {
        console.error("Error fetching sentiments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiments();
  }, []);

  const sentiments =
    [eventSentiment, activitySentiment, priestSentiment][tabIndex] || [];

  // Count emoji frequencies
  const emojiCount = {};
  sentiments.forEach((sentiment) => {
    (sentiment.responses || []).forEach((response) => {
      if (response.emoji) {
        emojiCount[response.emoji] = (emojiCount[response.emoji] || 0) + 1;
      }
    });
  });

  const chartData = {
    labels: Object.keys(emojiCount),
    datasets: [
      {
        data: Object.values(emojiCount),
        colors: (opacity = 1) =>
          Object.keys(emojiCount).map(
            (_, i) => chartColors[i % chartColors.length]
          ),
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width;

  if (loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="#fff">
        <Text fontSize={20}>Loading...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack space="$3" p="$4">
        <Text fontSize={24} fontWeight="bold" mb="$2">
          Feedback Reports
        </Text>
        <XStack space="$2" mb="$3" justifyContent="center">
          {TABS.map((tab, idx) => (
            <Button
              key={tab.key}
              size="$3"
              backgroundColor={tabIndex === idx ? "#26572E" : "#e0e0e0"}
              color={tabIndex === idx ? "#fff" : "#333"}
              onPress={() => setTabIndex(idx)}
            >
              {tab.label}
            </Button>
          ))}
        </XStack>

        <YStack alignItems="center" mt="$2">
          <Text fontSize={18} fontWeight="600" mb="$2">
            Emoji Sentiments
          </Text>
          {chartData.labels.length === 0 ? (
            <Text>No sentiment data available.</Text>
          ) : (
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [{ data: Object.values(emojiCount) }],
              }}
              width={screenWidth - 32}
              height={220}
              fromZero
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => "#26572E",
                labelColor: (opacity = 1) => "#333",
                style: { borderRadius: 16 },
                propsForBackgroundLines: {
                  stroke: "#e3e3e3",
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars
            />
          )}

          {/* Explanation Section */}
          <YStack
            mt="$4"
            p="$3"
            borderRadius={12}
            backgroundColor="#f4f4f4"
            width="100%"
          >
            <Text fontSize={16} fontWeight="bold" mb="$2">
              What do these sentiment metrics mean?
            </Text>
            <Text fontSize={13} color="#888" mb="$3">
              These sentiment metrics help us understand and calculate the
              feedback you provide. Your insights are valuable and help our
              parish grow—thank you for sharing your thoughts with us!
            </Text>
            <Text mb="$1">
              <Text fontWeight="bold">score:</Text> The overall sentiment score
              for the text. Positive values indicate positive sentiment,
              negative values indicate negative sentiment, and values near zero
              are neutral.
            </Text>
            <Text mb="$1">
              <Text fontWeight="bold">comparative:</Text> The average sentiment
              score per word, allowing comparison between texts of different
              lengths.
            </Text>
            <Text mb="$1">
              <Text fontWeight="bold">magnitude:</Text> The absolute strength of
              the sentiment, regardless of being positive or negative. Higher
              values mean stronger emotions.
            </Text>
            <Text mb="$1">
              <Text fontWeight="bold">words:</Text> The list of words found in
              the text that were analyzed for sentiment.
            </Text>
            <Text mb="$1">
              <Text fontWeight="bold">positive:</Text> Words in the text that
              contributed positively to the sentiment score.
            </Text>
            <Text>
              <Text fontWeight="bold">negative:</Text> Words in the text that
              contributed negatively to the sentiment score.
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default SentimentReports;
