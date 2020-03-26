import React, { useEffect, useState } from "react"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { FlatList, RefreshControl } from "react-native"

import api from "../../services/api"
import logoImg from "../../assets/logo.png"
import {
  Container,
  Header,
  Logo,
  HeaderText,
  HeaderTextBold,
  Title,
  Description,
  Incident,
  IncidentProperty,
  IncidentValue,
  DetailsButton,
  DetailsButtonText,
  LoaderContainer,
  Loader
} from "./styles"

export default function Incidents() {
  const navigation = useNavigation()
  const [incidents, setIncidents] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident })
  }

  async function refreshIncidents() {
    if (loading) {
      return
    }

    setRefreshing(true)

    const response = await api.get("/incidents", { params: { page: 1 } })

    setIncidents(response.data)
    setTotal(response.headers["x-total-count"])
    setPage(2)
    setRefreshing(false)
  }

  async function loadIncidents(refresh = false) {
    if (loading || refreshing) {
      return
    }

    if (total > 0 && incidents.length == total) {
      return
    }

    setLoading(true)

    const response = await api.get("/incidents", { params: { page } })

    setIncidents([...incidents, ...response.data])
    setTotal(response.headers["x-total-count"])
    setPage(page + 1)
    setLoading(false)
  }

  function renderFooter() {
    if (!loading) return null

    return (
      <LoaderContainer>
        <Loader size="large" color="#e02041" />
      </LoaderContainer>
    )
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  return (
    <Container>
      <Header>
        <Logo source={logoImg} />
        <HeaderText>
          Mostrando <HeaderTextBold>{incidents.length}</HeaderTextBold> de{" "}
          <HeaderTextBold> {total} casos</HeaderTextBold>.
        </HeaderText>
      </Header>

      <Title>Bem-vindo!</Title>
      <Description>Escolha um dos casos abaixo e salve o dia.</Description>

      <FlatList
        data={incidents}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshIncidents}
          />
        }
        renderItem={({ item: incident }) => (
          <Incident>
            <IncidentProperty>ONG:</IncidentProperty>
            <IncidentValue>{incident.name}</IncidentValue>

            <IncidentProperty>Caso:</IncidentProperty>
            <IncidentValue>{incident.title}</IncidentValue>

            <IncidentProperty>Valor:</IncidentProperty>

            <IncidentValue>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(incident.value)}
            </IncidentValue>

            <DetailsButton onPress={() => navigateToDetail(incident)}>
              <DetailsButtonText>Ver mais detalhes</DetailsButtonText>
              <Feather name="arrow-right" size={16} color="#e02041" />
            </DetailsButton>
          </Incident>
        )}
      />
    </Container>
  )
}
