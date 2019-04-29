package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
	"strconv"
)

type Card struct {
	Id       int    `json:"id"`
	Answer   string `json:"answer"`
	Question string `json:"question"`
}

type CardsHandler struct {
	db *sql.DB
}

func (h *CardsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		rows, err := h.db.Query("SELECT id, answer, question FROM cards ORDER BY id")
		cards := make([]*Card, 0)

		if err != nil {
			log.Fatal("Could not retrieve cards from database -- ", err)
		}

		defer rows.Close()

		for rows.Next() {
			id := new(int)
			answer := new(string)
			question := new(string)

			if err := rows.Scan(id, answer, question); err != nil {
				log.Fatal("Could not scan SQL row -- ", err)
			}

			cards = append(cards, &Card{
				*id,
				*answer,
				*question,
			})
		}

		// write the cards to the response as JSON
		if err := json.NewEncoder(w).Encode(cards); err != nil {
			log.Fatal("Could not encode JSON rows -- ", err)
		}
	} else if r.Method == "PATCH" {
		card := new(Card)

		if err := json.NewDecoder(r.Body).Decode(card); err != nil {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			if _, err := h.db.Exec("UPDATE cards SET answer = $2, question = $3 WHERE id = $1", card.Id, card.Answer, card.Question); err != nil {
				log.Fatal("Could not insert into the database -- ", err)
			}

			w.WriteHeader(http.StatusOK)
		}
	} else if r.Method == "POST" {
		card := new(Card)

		if err := json.NewDecoder(r.Body).Decode(card); err != nil {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			if _, err := h.db.Exec("INSERT INTO cards (answer, question) VALUES ($1, $2)", card.Answer, card.Question); err != nil {
				log.Fatal("Could not insert into the database -- ", err)
			}

			w.WriteHeader(http.StatusOK)
		}
	} else if r.Method == "DELETE" {
		card := new(Card)
		if err := json.NewDecoder(r.Body).Decode(card); err != nil {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			if _, err := h.db.Exec("DELETE FROM cards WHERE id = $1", card.Id); err != nil {
				log.Fatal("Could not delete from the database -- ", err)
			}

			w.WriteHeader(http.StatusOK)
		}
	}
}

func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Could not connect to database -- ", err)
	}

	if _, err := db.Query("CREATE TABLE IF NOT EXISTS cards (id SERIAL PRIMARY KEY , question TEXT, answer TEXT)"); err != nil {
		log.Fatal("Could not create database table -- ", err)
	}

	// Start-up the HTTP server
	port, err := strconv.Atoi(os.Getenv("API_SERVER_PORT"))
	if err != nil {
		port = 8080
	}

	http.Handle("/", &CardsHandler{db})
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
