import json
from collections import defaultdict

# -----------------------------
# LOAD JSON FILES
# -----------------------------
with open("articles.json") as f:
    articles_data = json.load(f)

with open("authors.json") as f:
    authors_data = json.load(f)

with open("universities.json") as f:
    univ_data = json.load(f)

# -----------------------------
# BUILD MAPS BY TITLE
# -----------------------------
authors_map = defaultdict(list)
for row in authors_data:
    title = row["title"].strip()
    author = row["author"].strip()
    if author not in authors_map[title]:
        authors_map[title].append(author)

univ_map = defaultdict(list)
for row in univ_data:
    title = row["title"].strip()
    univ = row["university"].strip()
    if univ not in univ_map[title]:
        univ_map[title].append(univ)

# -----------------------------
# MERGE INTO ARTICLES
# -----------------------------
merged_articles = []
for article in articles_data:
    title = article["title"].strip()
    # Merge authors and universities
    article["authors"] = "; ".join(authors_map.get(title, []))
    article["affiliations"] = "; ".join(univ_map.get(title, []))
    merged_articles.append(article)

# -----------------------------
# SAVE MERGED JSON
# -----------------------------
with open("merged_articles.json", "w") as f:
    json.dump(merged_articles, f, indent=2)

print("Merged JSON created: merged_articles.json")
