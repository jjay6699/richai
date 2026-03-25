export type IngredientTone =
  | "path-greens"
  | "path-berries"
  | "path-adaptogens"
  | "path-quiz"
  | "path-bloodwork";

export interface IngredientEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  ingredientList: string[];
  tone: IngredientTone;
}

export const ingredientEntries: IngredientEntry[] = [
  {
    slug: "organic-wheatgrass-powder",
    name: "Organic Wheatgrass Powder",
    category: "Greens & Algae",
    description: "Wheatgrass, the newly sprouted leaves of the common wheat plant (Triticum aestivum). In the first few weeks of growth, these leaves look like the grass in your yard. The wheatgrass is cut and then turned into a juice or dried and made into a powdered form. Generally, wheatgrass powder is gluten-free food since the gluten protein is present in the seeds and not the grasses. In reality, however, farming practices are not always exact and there is also the risk of cross-contamination involved in the manufacturing process. Thus, to be safe, not recommended for those who have celiac disease or on a gluten-free diet. Wheatgrass is a great alkaline food with an abundance amount of chlorophyll which helps in blood production and circulation. Health benefits of wheatgrass include neutralizing toxins in the body, improving skin health and various anti-aging benefits. It is also an immune booster that facilitates nutrient absorption. It contains chlorophyll, potassium, iron, zinc, phosphorus, calcium and magnesium and is a good source of vitamins A, C, E and B12. Our wheatgrass powder is a non-GMO product. It has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Wheatgrass Powder",
    ingredientList: [
      "100% Organic Wheatgrass Powder",
    ],
    tone: "path-greens",
  },
  {
    slug: "organic-chia-seed",
    name: "Organic Chia Seed",
    category: "Roots, Seeds & Spices",
    description: "Chia seeds are the tiny black seeds of the chia plant (Salvia hispanica). Native to Mexico and Guatemala, they were a staple food for the ancient Aztecs and Mayans. In fact, “chia” is the ancient Mayan word for “strength”. Chia seeds are small, flat, and oval-shaped with a shiny and smooth texture. These seeds are highly versatile. They can be soaked and added to porridge, made into pudding, used in baked goods, or simply sprinkled on top of salads or yogurt. Chia seeds were an important food for the Aztecs and Mayans back in the day as it is used as a source of energy. It is rich in omega 3 ALA, which is one of the two essential fatty acids the human body can’t produce on its own. It is ideal for heart health, better digestive system and helps the body stay hydrated. It is high in fiber, calcium, magnesium, phosphorus and protein",
    ingredients: "100% Organic Chia Seeds",
    ingredientList: [
      "100% Organic Chia Seeds",
    ],
    tone: "path-berries",
  },
  {
    slug: "organic-beetroot-powder",
    name: "Organic Beetroot Powder",
    category: "Roots, Seeds & Spices",
    description: "Beetroot (Beta vulgaris) is a root vegetable also known as red beet, table beet, garden beet, or just beet. Beetroot contains a bio-active antioxidant called Betacyanin which gives its purplish-red color. It increases oxygen uptake at cellular level, helps with blood pressure and protects the cardiovascular system. It is high in antioxidants as well as vitamins A, B6 and C and an excellent source of soluble fiber, calcium, folate, magnesium, potassium, iron, and zinc. There are numerous types of beetroot, many of which are distinguished by their color — yellow, white, pink, ruby red or dark purple. Our beetroot powder is in ruby red color and ours is a non-GMO product. It has no added preservatives, sugars and additives. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily. The unique compounds in beetroot are inorganic nitrate and betalains (betanin)",
    ingredients: "100% Organic Beetroot Powder",
    ingredientList: [
      "100% Organic Beetroot Powder",
    ],
    tone: "path-adaptogens",
  },
  {
    slug: "organic-cacao-powder",
    name: "Organic Cacao Powder",
    category: "Fruits & Antioxidants",
    description: "Cacao is where chocolate gets its start. Chocolate comes from Theobroma cacao, the scientific name for the cacao tree. A small tree native to the Amazon Basin, the cacao tree is now grown in tropical regions all over the world. The fleshy fruit, or pods, of the cacao tree contains brown seeds often called cacao or cocoa “beans,” though they’re not really legumes. Cacao beans develop flavor and texture through a fermentation process before they’re processed into either cacao or cocoa powder. Cacao powder is made by cold pressing non-roasted cacao beans and retains more of the natural antioxidants of the beans themselves. Organic Fields Cacao Powder is 100% organic without any additional sweetener, preservatives and additives. Benefits from consuming cacao can be achieved if the cacao content is at least 70% while ours is 100% cacao powder, thus, no need to worry! You may achieve the desired result when consuming our Organic Cacao Powder!",
    ingredients: "100% Organic Cacao Powder",
    ingredientList: [
      "100% Organic Cacao Powder",
    ],
    tone: "path-quiz",
  },
  {
    slug: "just-green",
    name: "Just Green",
    category: "Signature Blends",
    description: "Just Greens is formulated to provide a powerful blend of nutritious greens and phytonutrient-packed veggies. It is a good source of fiber, chlorophyll and antioxidants. It supports weight loss, neutralizes toxins in the body and has anti-aging properties. Just Greens is a non GMO product and it is safe to consume as it is food grade. Our product has no added preservatives, sugars and additives. There is also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about the safety. Noted that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily. Ingredients List 100% Organic Broccoli Powder, 100% Organic Wheatgrass Powder,100% Organic Moringa Leaf Powder, 100% Organic Matcha Powder and 100% Organic Kale Powder",
    ingredients: "100% Organic Broccoli Powder, 100% Organic Wheatgrass Powder,100% Organic Moringa Leaf Powder, 100% Organic Matcha Powder and 100% Organic Kale Powder",
    ingredientList: [
      "100% Organic Broccoli Powder",
      "100% Organic Wheatgrass Powder",
      "100% Organic Moringa Leaf Powder",
      "100% Organic Matcha Powder",
      "100% Organic Kale Powder",
    ],
    tone: "path-bloodwork",
  },
  {
    slug: "just-berries",
    name: "Just Berries",
    category: "Signature Blends",
    description: "Just Berries is formulated to provide a powerful blend of nutritious berries and phytonutrient-packed fruits. It is a good source of fiber, antioxidants. It has anti-aging properties. Just Berries is a non GMO product and it is safe to consume. Our product has no added preservatives, sugars and additives. Thus, no need to worry about the safety. Noted that the powder is organic, with no emulsifier/wetting agent that allows the food to dissolve easily. Mixture of berries is really good antioxidants for your body. It will boost your day by sprinkle them into your breakfast, smoothie or drinks! Just Berries will also nourish your skin from the inside out and look more fresh and young",
    ingredients: "100% Organic Acai Berry Powder, 100% Organic Blueberry Powder, 100% Organic Cranberry Powder, 100% Organic Strawberry Powder",
    ingredientList: [
      "100% Organic Acai Berry Powder",
      "100% Organic Blueberry Powder",
      "100% Organic Cranberry Powder",
      "100% Organic Strawberry Powder",
    ],
    tone: "path-greens",
  },
  {
    slug: "superfood-collagen-tripeptide",
    name: "Superfood Collagen Tripeptide",
    category: "Signature Blends",
    description: "Our collagen is the first formula in the market with the incorporation of our Superfoods Just Berries. We use collagen tripeptides which are in smaller molecules and generally more bioavailable – they are better absorbed into the bloodstream because they are much shorter chains of amino acids than collagen, and significant effects could be noticed. The use of superfoods may help in boosting your immune system and give you ‘that’ glow as superfoods are known for the high content of vitamins and minerals. Worry about the sugar content in most collagen products? With Organic Fields Superfoods + Collagen Tripeptides, you shouldn’t! We don’t use any additional sweetener! Why We Use Collagen Tripeptides? The collagen included in foods is a chain of about 3,000 pieces of amino acids. Besides, general collagen supplements are made by a chain of about 30 to 100 pieces of amino acids. Those 2 types of collagen are too big to be absorbed as they are from the intestine, hence are delivered after digestion by gastrointestinal enzymes. Collagen Tripeptide (CTP) is a minimum unit of collagen consists of 3 amino acids (Glycine, Proline and Hydroxyproline). CTP, differs from conventional collagens, it is absorbed by the intestinal tract directly. What is more surprising, CTP has an innovative characteristic that is to be absorbed by collagen-affiliated organs such as the skin, bones, cartilages, and tendons preferentially. Moreover, it has been confirmed various functions of CTP such as activating of the body's ability to produce new collagen and hyaluronic acid, making bones and tendons stronger, and so on",
    ingredients: "50% Collagen tripeptides (fish), 50% Just Berries (organic acai berry powder, organic blueberry powder, organic cranberry powder, and organic strawberry powder)",
    ingredientList: [
      "50% Collagen tripeptides (fish)",
      "50% Just Berries (organic acai berry powder",
      "organic blueberry powder",
      "organic cranberry powder",
      "organic strawberry powder)",
    ],
    tone: "path-berries",
  },
  {
    slug: "organic-kale-powder",
    name: "Organic Kale Powder",
    category: "Greens & Algae",
    description: "Dubbed ‘The King of Greens’, kale is a lutein-rich superfood that promotes healthy vision. Kale is a green, leafy, cruciferous vegetable that is rich in nutrients. The kale antioxidant quercetin has anti-viral properties which may treat the common cold. It supplies insoluble fiber for our diet, something most of us aren’t getting enough of. Consuming kale may improve your cholesterol profile, detoxify your body and keep your liver healthy. It is rich in fiber and chlorophyll as well as a good source of vitamin C, vitamin K and pro-vitamin A. Kale can be good for adding fiber and antioxidants to the diet in many savory dishes, salads, and smoothies. It is a member of the mustard, or Brassicaceae, family, as are cabbage and brussels sprouts. Kale is a nutritious food rich in antioxidants, vitamin C, vitamin K, and beta-carotene. It also contains nutrients that can support eye health, weight management, heart health, and more. Our kale powder is a non GMO product and it is safe to consume as it is food grade. Our product has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Kale Powder",
    ingredientList: [
      "100% Organic Kale Powder",
    ],
    tone: "path-adaptogens",
  },
  {
    slug: "organic-turmeric-powder",
    name: "Organic Turmeric Powder",
    category: "Roots, Seeds & Spices",
    description: "Turmeric (Curcuma longa), a plant in the ginger family, is native to Southeast Asia and is grown commercially in that region, primarily in India. Its rhizome (underground stem) is used as a culinary spice and traditional medicine. Historically, turmeric was used in Ayurveda and other traditional Indian medical systems. In India, it was traditionally used for disorders of the skin, upper respiratory tract, joints, and digestive system. Curcumin is a major component of turmeric, and the activities of turmeric are commonly attributed to curcuminoids (curcumin and closely related substances). Curcumin gives turmeric its yellow color. Turmeric contains curcumin, a substance with powerful anti-inflammatory and antioxidant properties. Curcumin has beneficial effects on several factors known to play a role in heart disease. It improves the function of the endothelium, which is the lining of the blood vessels. It is also a natural anti-inflammatory. Our turmeric powder is a non-GMO product. It has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Turmeric Powder",
    ingredientList: [
      "100% Organic Turmeric Powder",
    ],
    tone: "path-quiz",
  },
  {
    slug: "organic-maca-powder",
    name: "Organic Maca Powder",
    category: "Roots, Seeds & Spices",
    description: "The maca plant, also called Lepidium meyenii or “Peruvian ginseng,” is a cruciferous vegetable related to broccoli, cauliflower, cabbage, and kale. Native to the high Andean plateaus, it has been cultivated for over 2,000 years and can survive the harsh weather of the Peruvian Andes above 4,000 meters (m) or 13,123 feet (ft). Maca root powder is very nutritious, and is a great source of several important vitamins and minerals. Maca root is said to support energy, libido, and sexual function. It is raw maca root that did not undergo high temperature heating process thereby preserving the maximum amount of nutrients such as enzymes and vitamin C. It is raw maca root that did not undergo high temperature heating process thereby preserving the maximum amount of nutrients such as enzymes and vitamin C. Generally, there are three types of maca which are yellow maca, red maca and black maca. Ours is yellow maca, and it is a non GMO product and it is safe to consume as it is food grade. Our product has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Maca Powder",
    ingredientList: [
      "100% Organic Maca Powder",
    ],
    tone: "path-bloodwork",
  },
  {
    slug: "organic-spirulina-powder",
    name: "Organic Spirulina Powder",
    category: "Greens & Algae",
    description: "Spirulina is a natural algae and it considered the most nutrient dense food on the planet. It is usually harvested from bodies of water such as lakes or farmed in ponds. First used by the Aztecs (were a Mesoamerican culture that flourished in central Mexico in the post-classic period from 1300 to 1521) as an endurance-booster, spirulina is considered a superfood — an all-in-one source of nutrients including protein levels comparable to eggs. This superfood is highly recommended to vegetarians due to its high natural iron, protein and essential amino acid content. It is ideal to consume spirulina during pregnancy or anytime the immune system needs a boost and is often taken for increased energy, eye health, brain function and for improving nerve function. Our spirulina powder is a non-GMO product. It has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Spirulina Powder",
    ingredientList: [
      "100% Organic Spirulina Powder",
    ],
    tone: "path-greens",
  },
  {
    slug: "organic-matcha-powder",
    name: "Organic Matcha Powder",
    category: "Greens & Algae",
    description: "Matcha is an ancient Japanese superfood that is used as an aid for meditation practices. It contains a unique antioxidant, catechins, of which 60% is Epigallocatechin gallate (EGCg) making it a potent and beneficial antioxidant. Compared to regular brewed green tea, match has 137 times more antioxidants and it supports weight loss by increasing metabolism. It detoxifies the body, is anti-aging, enhances mood and boosts memory as well as concentration. Matcha comes from the Camellia sinensis plant. However, it’s grown differently and has a unique nutrient profile. Farmers shade the plants used for matcha for most of the growth period. This lack of direct sunlight increases chlorophyll production, boosts the amino acid content, and gives the plant a darker green hue. After harvesting the leaves, producers remove the stems and veins and grind the leaves into a fine powder. Matcha contains the nutrients from the entire tea leaf and contains more caffeine and antioxidants than are typically present in green tea. Our matcha powder is a non GMO product and it is safe to consume as it is food grade. Our product has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Matcha Powder",
    ingredientList: [
      "100% Organic Matcha Powder",
    ],
    tone: "path-berries",
  },
  {
    slug: "organic-moringa-leaf-powder",
    name: "Organic Moringa Leaf Powder",
    category: "Greens & Algae",
    description: "Moringa leaf is a nutrient-packed food that comes from the Moringa oleifera tree in India. Moringa oleifera leaves, seeds, bark, roots, sap, and flowers have long been used in traditional medicine throughout South Asia and Southeast Asia. Moringa leaf is said to provide 7 times more vitamin C than oranges, 10 times more vitamin A than carrots, 17 times more calcium than milk, 9 times more protein than yoghurt, 15 times more potassium than bananas and 25 times more iron than spinach. Our moringa leaf powder is a non GMO product and it is safe to consume. Moringa is loaded with bio-available nutrients that our bodies can absorb easily. It helps with stress reduction, immunity, muscle growth and gives an energy boost. It helps with blood glucose level and contains plant protein including all 9 essential amino acids. It is high in fiber, calcium and antioxidants and is a rich source of iron and vitamins A, K and E. Our product has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Moringa Leaf Powder",
    ingredientList: [
      "100% Organic Moringa Leaf Powder",
    ],
    tone: "path-adaptogens",
  },
  {
    slug: "organic-chlorella-powder",
    name: "Organic Chlorella Powder",
    category: "Greens & Algae",
    description: "ORGANIC FIELDS organic chlorella powder contains a wide range of antioxidants such as omega-3s, vitamin C, and carotenoids like beta-carotene and lutein. This nutrient-dense algae is a complete protein source and contains all nine essential amino acids. Chlorella could help enhance your body’s natural ability to clear toxins. Chlorella has been found to enhance the immune response in both animal and human studies. Our chlorella powder is a non GMO product. It has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Chlorella Powder",
    ingredientList: [
      "100% Organic Chlorella Powder",
    ],
    tone: "path-quiz",
  },
  {
    slug: "organic-acai-berry",
    name: "Organic Acai Berry",
    category: "Fruits & Antioxidants",
    description: "Acai Berry are a grape-like fruit native to the rainforests of South America. They are harvested from acai palm trees. The fruits are about 1 to 2 centimeters (cm) in diameter and a deep purple color. The seed constitutes about 80 percent of the fruit. Acai Berry have been called a superfood, with benefits ranging from improved skin appearance to weight loss. Our acai berry powder is a non GMO product. It has no added preservatives, sugars and additives. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Acai Berry Powder",
    ingredientList: [
      "100% Organic Acai Berry Powder",
    ],
    tone: "path-bloodwork",
  },
  {
    slug: "organic-ginger-powder",
    name: "Organic Ginger Powder",
    category: "Roots, Seeds & Spices",
    description: "Native to parts of Asia, such as China, Japan, and India, ginger has a leafy stem and yellowish-green flowers. The spice comes from the rhizome (underground stem) of the plant. Ginger has been used for medicinal purposes in China for more than 2,500 years, and it has had a prominent role in Chinese, Indian, and Japanese medicine since the 1500s. Ginger has been traditionally used for upset stomach and motion sickness. Ginger tea is often recommended for people having nausea and digestive issues. Gingerol is the main bioactive compound in ginger. Our ginger powder is a non-GMO product. It has no added preservatives, sugars and additives. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily. The unique compounds in ginger are gingerol, shogaols, zingiberene, and zingerone",
    ingredients: "100% Organic Ginger Powder",
    ingredientList: [
      "100% Organic Ginger Powder",
    ],
    tone: "path-greens",
  },
  {
    slug: "organic-barley-grass-powder",
    name: "Organic Barley Grass Powder",
    category: "Greens & Algae",
    description: "Barley grass, sometimes called barley greens, comes from young barley plants that haven’t started making seeds. During this stage of the plant’s life, it’s full of nutrients that help it grow larger leaves and seeds. Each serving of barley grass contains a good amount of vitamin A, a fat-soluble vitamin that regulates immune function, cell growth, and vision. It’s also high in vitamin C, which plays a central role in everything from skin health to wound healing to oral health. Barley grass is also rich in polyphenols and flavonoids. ORGANIC FIELDS organic barley grass is rich in vitamins A and C, which act as antioxidants. It’s a superfood that is widely used as a supplement to boost weight loss, enhance immune function, and support overall health. Our barley grass powder is a non GMO product. It has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Barley Grass Powder",
    ingredientList: [
      "100% Organic Barley Grass Powder",
    ],
    tone: "path-berries",
  },
  {
    slug: "just-slim",
    name: "Just Slim",
    category: "Signature Blends",
    description: "Just Slim is specially formulated after years of research and feedback from our loyal customer. Perfect superfood blend for detox and losing weight, combining matcha, lemon, apple, flaxseed powder and pomegranate powder. Can be blended easily into your daily drink, cereals or smoothies. Just Slim is formulated to provide a powerful blend of detoxifying, weight-losing and phytonutrient-packed food. It consists of five ingredients which are organic apple powder, organic flaxseed powder, organic lemon powder, organic matcha powder and organic pomegranate powder. In addition, it is also a good source of antioxidants and has anti-aging properties. Just Slim is a non GMO product and it is safe to consume. Our product has no added preservatives, sugars and additives. Thus, no need to worry about safety. Note that the powder is organic, with no emulsifier or wetting agent that allows the food to dissolve easily. All ingredients in Just Slim are natural fat burners",
    ingredients: "Organic Apple Powder, Organic Flaxseed Powder, Organic Lemon Powder, Organic Matcha Powder and Organic Pomegranate Powder",
    ingredientList: [
      "Organic Apple Powder",
      "Organic Flaxseed Powder",
      "Organic Lemon Powder",
      "Organic Matcha Powder",
      "Organic Pomegranate Powder",
    ],
    tone: "path-adaptogens",
  },
  {
    slug: "organic-maqui-berry-powder",
    name: "Organic Maqui Berry Powder",
    category: "Fruits & Antioxidants",
    description: "Maqui berries (Aristotelia chilensis), purple-black berries domestic in Chile and Argentina. Long consumed locally as a fresh fruit or in juice form, maqui berry is now can be found as a freeze-dried powder made from the whole fruit, just as Organic Fields Organic Maqui Berry Powder. Maqui berry offers numerous health benefits, partly due to substances in the berries such as anthocyanins, and flavonoids that have antioxidant and anti-inflammatory effects. Our maqui berry powder is a non GMO product and it is safe to consume. Our product has no added preservatives, sugars and additives. Thus, no need to worry about safety. Note that the powder is organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Maqui Berry Powder",
    ingredientList: [
      "100% Organic Maqui Berry Powder",
    ],
    tone: "path-quiz",
  },
  {
    slug: "just-mushroom",
    name: "Just Mushroom",
    category: "Signature Blends",
    description: "Mushrooms are fungi, which is a separate kingdom of life from plants and animals. Technically, they are not a vegetable, but they are often used and served as a vegetable in recipes. Mushrooms are a low calorie, high-fiber food choice that can be used diversely in cooking. They add a savory flavor to recipes but are very low in sodium, making them a healthy choice. Organic Fields Just Mushroom is formulated to provide a powerful blend of mushrooms and phytonutrient-packed food. It is a good source of antioxidants. It has anti-aging properties. Enjoy the power of mushroom. Reishi mushroom has body-and-mind balancing properties. Chaga mushroom helps you keep a bulletproof immunity to stay healthy. Lion's Mane is an all-natural brain booster. Shiitake mushroom is a true beauty food. Just Mushroom is a non GMO product and it is safe to consume. Our product has no added preservatives, sugars and additives. Thus, no need to worry about the safety. Noted that the powder is organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "Organic Chaga Powder, Organic Reishi Powder, Organic Shiitake Powder, Organic Maitake Powder and Organic Lion’s Mane Powder",
    ingredientList: [
      "Organic Chaga Powder",
      "Organic Reishi Powder",
      "Organic Shiitake Powder",
      "Organic Maitake Powder",
      "Organic Lion’s Mane Powder",
    ],
    tone: "path-bloodwork",
  },
  {
    slug: "organic-ceylon-cinnamon-powder",
    name: "Organic Ceylon Cinnamon Powder",
    category: "Roots, Seeds & Spices",
    description: "Cinnamon has been used as a spice by human beings since ancient times. Ceylon cinnamon also known as the true cinnamon is found primarily in Sri Lanka and southern regions of India. The spice constitutes many bioactive compounds with antioxidant, antimicrobial, and insecticidal properties, in addition to therapeutic and preventive effects against many diseases and disorders. Our Organic Cinnamon Powder is the botanical variety Cinnamomum zeylanicum and comes from the bark of the laurel tree. It is a GMO-free product and 100% natural with no added preservatives, sugars, acids, colorants and additives. Note that there is also no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Ceylon Cinnamon Powder",
    ingredientList: [
      "100% Organic Ceylon Cinnamon Powder",
    ],
    tone: "path-greens",
  },
  {
    slug: "organic-blueberry-powder",
    name: "Organic Blueberry Powder",
    category: "Fruits & Antioxidants",
    description: "Discover the health benefits of our Organic Blueberry Powder. Made from 100% organic blueberries. Blueberries, flowering plants from the genus Vaccinium (family Ericaceae) native to North America. Small blue coloured berries offer a diverse range of micronutrients including powerful antioxidants such as resveratrol and anthocyanins. By utilizing a freeze-drying and milling technique in the production of our blueberry powder, the powder preserves the nutritional advantages found in the fresh berries. Our blueberry powder is a GMO-free product. It is 100% natural with no added preservatives, sugars, acids, colorants and additives. Note that there is also no emulsifier/wetting agent that allows the food to dissolve easily. Add a boost of flavor and nutrition to your smoothies, baked goods, and more with our versatile and pure blueberry powder",
    ingredients: "100% Organic Blueberries",
    ingredientList: [
      "100% Organic Blueberries",
    ],
    tone: "path-berries",
  },
  {
    slug: "organic-baobab-powder",
    name: "Organic Baobab Powder",
    category: "Fruits & Antioxidants",
    description: "Baobab (Adansonia digitata) is a tree native to Africa, Madagascar, Australia, and the Arabian Peninsula. Baobab is nutritious fruit with a citrusy flavour that grows on the African 'Tree of Life'. It's commonly used as a source of water and food. The wood of the baobab tree trunk has a water content of up to 79%. The fruit and leaves are rich in many nutrients and are used as food. The baobab fruit is minimally processed; the seeds are removed and the fruit is simply sieved to create a natural powder. Our baobab powder is a non GMO product. It has no added preservatives, sugars and additives. There are also no additional prebiotics, probiotics, or digestive enzymes. Thus, no need to worry about safety. Note that the powder is 100% organic, with no emulsifier/wetting agent that allows the food to dissolve easily",
    ingredients: "100% Organic Baobab Powder",
    ingredientList: [
      "100% Organic Baobab Powder",
    ],
    tone: "path-adaptogens",
  },
  {
    slug: "organic-lemon-powder",
    name: "Organic Lemon Powder",
    category: "Fruits & Antioxidants",
    description: "Our Organic Lemon Powder is made from whole lemon without the seeds. It tastes sour with a hint of bitterness, this vitamin C-rich powder is made from real organic lemons, great for drinks, cooking, and daily wellness",
    ingredients: "Organic lemon powder",
    ingredientList: [
      "Organic lemon powder",
    ],
    tone: "path-quiz",
  },
  {
    slug: "organic-tomato-powder",
    name: "Organic Tomato Powder",
    category: "Fruits & Antioxidants",
    description: "Our Organic Tomato Powder is slightly sweet with a hint of umami. Made from real organic tomatoes, perfect for soups, sauces, and seasoning blends",
    ingredients: "Organic tomato powder",
    ingredientList: [
      "Organic tomato powder",
    ],
    tone: "path-bloodwork",
  },
  {
    slug: "natural-cocoa-powder",
    name: "Natural Cocoa Powder",
    category: "Fruits & Antioxidants",
    description: "Rich in flavor and full of natural goodness, our Natural Cocoa Powder is made from premium-quality cacao beans—roasted, ground, and processed without any added sugar or preservatives. It retains its authentic chocolate aroma and deep, earthy taste, making it perfect for baking, beverages, smoothies, and healthy treats",
    ingredients: "100% Natural Cocoa Powder",
    ingredientList: [
      "100% Natural Cocoa Powder",
    ],
    tone: "path-greens",
  },
];

export const ingredientCategories = Array.from(new Set(ingredientEntries.map((entry) => entry.category)));
