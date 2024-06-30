import { claudSonnet } from "@/lib/bedrock";
import { streamText } from "ai";
import { fetchHTMl, cleanHtml } from "../extract/route";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const system = `You will be given a string that resembles HTML. Your task is to find a food recipe in the HTML and extract the ingredients, instructions, and the title of the recipe. You will also include estimated calories for the whole recipe as well as per serving. You will only return the information I've asked for. You will never speak from the perspective of a language model or allude to being an AI or computer assistant in any way. Your response will be displayed in a frontend application. If the string does not contain a recipe do not return one. Instead, return: "failed to retrieve recipe"
	This is an example of a good repsonse:

	Ingredients

1 lb boneless, skinless chicken breast cut into 1 inch cubes
salt and pepper to taste
2 tbsp olive oil divided
2 cups broccoli florets
1/2 yellow bell pepper cut into 1 inch pieces
1/2 red bell pepper cut into 1 inch pieces
1/2 cup baby carrots sliced
2 tsp minced ginger
2 garlic cloves minced
Stir Fry Sauce
1 tbsp corn starch
2 tbsp cold water
1/4 cup low sodium chicken broth
3 tbsp low sodium soy sauce
1/4 cup honey
1 tbsp toasted sesame oil
1/2 tsp crushed red pepper flakes
Instructions
Stir Fry Sauce
In a medium size bowl, whisk together corn starch and water. Add remaining ingredients (chicken broth, soy sauce, honey, and toasted sesame oil, red pepper flakes) and whisk to combine. Set aside.
Add one tablespoon of olive oil to a large skillet or wok and heat over medium high heat.
Add chicken (in batches if necessary) and season with salt and pepper. Cook for 3 to 5 minutes or until cooked through. Remove from skillet.
Reduce heat to medium and add remaining tablespoon of oil to the skillet.
Add broccoli, bell pepper, and carrots and cook, stirring occasionally, just until crisp tender. Add ginger and garlic and cook for an additional minute.
Add chicken back into the skillet and stir to combine.

Whisk stir fry sauce and pour over chicken and vegetables and stir gently to combine.
Bring to a boil, stirring occasionally, and let boil for one minute.
Serve with rice and/or chow mein if desired.
Nutrition
Calories: 343kcal | Carbohydrates: 29g | Protein: 26g | Fat: 13g | Saturated Fat: 2g | Cholesterol: 72mg | Sodium: 570mg | Potassium: 709mg | Fiber: 2g | Sugar: 19g | Vitamin A: 3095IU | Vitamin C: 89.1mg | Calcium: 35mg | Iron: 1.4mg
	


Another good response: 

Ingredients:

- 600g beef mince (for single burgers) or 1.2kg (for double burgers)
- Salt and pepper
- 2-3 tbsp canola oil
- 4 soft burger buns 
- 4-8 slices burger cheese
- Lettuce leaves
- 2 large tomatoes, sliced
- 1 red onion, sliced
- 2 large gherkins, sliced

For the sauce:
- Special Burger Sauce or Tomato Chutney Burger Sauce (recipes linked)

Instructions:

1. Form beef into 4 patties (or 8 for doubles). Make a dent in the center of each patty.

2. Preheat a cast iron skillet over high heat until very hot. 

3. Season patties with salt and pepper just before cooking.

4. Cook patties for 1.5 minutes per side. Add cheese after flipping.

5. Toast burger buns.

6. Assemble burgers: Bun, sauce, lettuce, tomato, patty, gherkins, onion, more sauce, top bun.

	`;
	const html = await fetchHTMl(messages[0].content);
	const cleanedHtml = cleanHtml(html!);
	const result = await streamText({
		model: claudSonnet,
		system,
		prompt: cleanedHtml,
	});

	return result.toAIStreamResponse();
}
