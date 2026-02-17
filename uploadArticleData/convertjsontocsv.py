import json
import csv

with open("merged_articles.json") as f:
    data = json.load(f)

with open("merged_articles.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    # Write header
    writer.writerow(["title", "year", "journal", "authors", "affiliations", "disciplineabbr", "utd24", "ft50"])
    # Write rows
    for art in data:
        writer.writerow([
            art.get("title"),
            art.get("year"),
            art.get("journal"),
            art.get("authors"),
            art.get("affiliations"),
            art.get("disciplineabbr"),
            art.get("utd24"),
            art.get("ft50")
        ])
