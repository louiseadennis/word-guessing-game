from pathlib import Path

home_path = Path.cwd()
in_path = home_path/'words.txt'

text = in_path.read_text() # read_text opens and closes the file
text_words = text.split() # splits the contents into list of words at all whitespace

six_letter_words = []
for word in text_words:
    if len(word) == 6:
        six_letter_words.append(word)
        
for word in six_letter_words:
    print(word)
