const names = [
  "Marie", "Jean", "Sophie", "Pierre", "Camille", "Luc", "Julie", "Paul", "Claire", "Louis", "Élise", "Antoine", "Charlotte", "Hugo", "Emma", "Lucas", "Léa", "Nicolas", "Manon", "Thomas", "Sarah", "Mathieu", "Chloé", "Julien", "Anaïs", "Alexandre", "Laura", "Maxime", "Émilie", "Baptiste", "Pauline", "Théo", "Margaux", "Romain", "Amandine", "Quentin", "Mélanie", "Guillaume", "Céline", "Vincent", "Aurélie", "Adrien", "Justine", "Simon", "Élodie", "Nathan", "Marine", "Florian", "Isabelle", "Jules", "Alice", "Victor", "Eva", "Benjamin", "Noémie", "Clément", "Agathe", "Sébastien", "Mathilde", "David", "Océane", "Raphaël", "Caroline", "Samuel", "Morgane", "Georges", "Estelle", "Philippe", "Inès", "François", "Lola", "Charles", "Ambre", "André", "Solène", "Henri", "Maëlle", "Patrice", "Salomé", "Gaspard", "Lison", "Pascal", "Éva", "Laurent", "Mia", "Denis", "Louna", "Alain", "Jade", "Michel", "Rose", "Christian", "Zoé", "Dominique", "Léna", "Yves", "Lilou", "René", "Romane", "Serge", "Anaëlle", "Jacques", "Éden", "Gérard", "Lina", "Raymond", "Nina", "Marcel", "Clara"
];

const comparisons = [
  {
    s: [
      ["est plus fort(e) que", "n'est pas aussi faible que"],
      ["est plus faible que", "n'est pas aussi fort(e) que"],
    ],
    q: [
      ["plus fort(e)", "moins faible"],
      ["plus faible", "moins fort(e)"],
    ],
  },
  {
    s: [
      ["est plus intelligent(e) que", "n'est pas aussi bête que"],
      ["est plus bête que", "n'est pas aussi intelligent(e) que"],
    ],
    q: [
      ["plus intelligent(e)", "moins bête"],
      ["plus bête", "moins intelligent(e)"],
    ],
  },
  {
    s: [
      ["est plus grand(e) que", "n'est pas aussi petit(e) que"],
      ["est plus petit(e) que", "n'est pas aussi grand(e) que"],
    ],
    q: [
      ["plus grand(e)", "moins petit(e)"],
      ["plus petit(e)", "moins grand(e)"],
    ],
  },
  {
    s: [
      ["est plus courageux(-se) que", "n'est pas aussi peureux(-se) que"],
      ["est plus peureux(-se) que", "n'est pas aussi courageux(-se) que"],
    ],
    q: [
      ["plus courageux(-se)", "moins peureux(-se)"],
      ["plus peureux(-se)", "moins courageux(-se)"],
    ],
  },
  {
    s: [
      ["est plus gentil(le) que", "n'est pas aussi cruel(le) que"],
      ["est plus cruel(le) que", "n'est pas aussi gentil(le) que"],
    ],
    q: [
      ["plus gentil(le)", "moins cruel(le)"],
      ["plus cruel(le)", "moins gentil(le)"],
    ],
  },
  {
    s: [
      ["est plus drôle que", "n'est pas aussi sérieux(-se) que"],
      ["est plus sérieux(-se) que", "n'est pas aussi drôle que"],
    ],
    q: [
      ["plus drôle", "moins sérieux(-se)"],
      ["plus sérieux(-se)", "moins drôle"],
    ],
  },
  {
    s: [
      ["est plus amical(e) que", "n'est pas aussi hostile que"],
      ["est plus hostile que", "n'est pas aussi amical(e) que"],
    ],
    q: [
      ["plus amical(e)", "moins hostile"],
      ["plus hostile", "moins amical(e)"],
    ],
  },
  {
    s: [
      ["est plus généreux(-se) que", "n'est pas aussi égoïste que"],
      ["est plus égoïste que", "n'est pas aussi généreux(-se) que"],
    ],
    q: [
      ["plus généreux(-se)", "moins égoïste"],
      ["plus égoïste", "moins généreux(-se)"],
    ],
  },
  {
    s: [
      ["est plus confiant(e) que", "n'est pas aussi anxieux(-se) que"],
      ["est plus anxieux(-se) que", "n'est pas aussi confiant(e) que"],
    ],
    q: [
      ["plus confiant(e)", "moins anxieux(-se)"],
      ["plus anxieux(-se)", "moins confiant(e)"],
    ],
  },
  {
    s: [
      ["est plus calme que", "n'est pas aussi nerveux(-se) que"],
      ["est plus nerveux(-se) que", "n'est pas aussi calme que"],
    ],
    q: [
      ["plus calme", "moins nerveux(-se)"],
      ["plus nerveux(-se)", "moins calme"],
    ],
  },
];

export default {
  names,
  comparisons,
  question: "Qui est",
};
