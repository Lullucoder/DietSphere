package com.nutrition.dietbalancetracker.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.nutrition.dietbalancetracker.model.FoodCategory;
import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.model.NutrientProfile;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import com.nutrition.dietbalancetracker.repository.NutrientProfileRepository;

import lombok.RequiredArgsConstructor;

/**
 * DATA INITIALIZER
 * ================
 * Adds sample foods to the database on startup.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final FoodItemRepository foodItemRepository;
    private final NutrientProfileRepository nutrientProfileRepository;
    
    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (foodItemRepository.count() == 0) {
            initializeSampleFoods();
        }
    }
    
    private void initializeSampleFoods() {

        // =====================================================================
        //  GENERAL / EXISTING FOODS
        // =====================================================================

        createFood("Apple", "Fresh medium apple", FoodCategory.FRUIT,
                95, 0.5, 25, 0.3, 4.4,
                5, 8.4, 0, 0.3, 4, 0,
                11, 0.2, 9, 0.1, 195);

        createFood("Banana", "Medium banana", FoodCategory.FRUIT,
                105, 1.3, 27, 0.4, 3.1,
                4, 10.3, 0, 0.1, 0.6, 0,
                6, 0.3, 32, 0.2, 422);

        createFood("Chicken Breast", "Grilled skinless chicken breast (100g)", FoodCategory.PROTEIN,
                165, 31, 0, 3.6, 0,
                6, 0, 0.1, 0.3, 0, 0.3,
                11, 0.7, 29, 0.7, 256);

        createFood("Brown Rice", "Cooked brown rice (1 cup)", FoodCategory.GRAIN,
                216, 5, 45, 1.8, 3.5,
                0, 0, 0, 0.1, 1.2, 0,
                20, 0.8, 86, 1.2, 154);

        createFood("Broccoli", "Steamed broccoli (1 cup)", FoodCategory.VEGETABLE,
                55, 3.7, 11, 0.6, 5.1,
                120, 101, 0, 1.5, 220, 0,
                62, 1.0, 33, 0.7, 457);

        createFood("Milk", "Whole milk (1 cup)", FoodCategory.DAIRY,
                149, 7.7, 11.7, 7.9, 0,
                68, 0, 3.2, 0.1, 0.5, 1.1,
                276, 0.1, 24, 0.9, 322);

        createFood("Egg", "Large boiled egg", FoodCategory.PROTEIN,
                78, 6.3, 0.6, 5.3, 0,
                75, 0, 1.1, 0.5, 0.3, 0.6,
                25, 0.6, 5, 0.5, 63);

        createFood("Salmon", "Grilled salmon fillet (100g)", FoodCategory.PROTEIN,
                206, 22, 0, 13, 0,
                12, 0, 14.4, 3.5, 0.5, 2.8,
                9, 0.3, 27, 0.4, 363);

        createFood("Spinach", "Raw spinach (1 cup)", FoodCategory.VEGETABLE,
                7, 0.9, 1.1, 0.1, 0.7,
                141, 8.4, 0, 0.6, 145, 0,
                30, 0.8, 24, 0.2, 167);

        createFood("Almonds", "Raw almonds (28g)", FoodCategory.NUT_SEED,
                164, 6, 6, 14, 3.5,
                0, 0, 0, 7.3, 0, 0,
                76, 1.0, 76, 0.9, 208);

        // =====================================================================
        //  NORTH INDIAN – BREADS
        // =====================================================================

        createFood("Chapati", "Whole-wheat roti (1 piece, ~40g flour)", FoodCategory.GRAIN,
                120, 3.5, 20, 3.5, 2.5,
                0, 0, 0, 0.3, 1.5, 0,
                10, 1.0, 25, 0.5, 50);

        createFood("Naan", "Tandoor-baked naan bread (1 piece ~90g)", FoodCategory.GRAIN,
                262, 8.7, 45, 5.1, 2.0,
                0, 0, 0, 0.2, 0.5, 0,
                48, 2.8, 24, 0.7, 63);

        createFood("Paratha", "Plain layered paratha (1 piece ~80g)", FoodCategory.GRAIN,
                260, 5, 36, 10, 2.5,
                0, 0, 0, 1.0, 3, 0,
                15, 1.5, 30, 0.6, 80);

        createFood("Aloo Paratha", "Potato-stuffed paratha (1 piece ~120g)", FoodCategory.GRAIN,
                300, 6, 40, 13, 3.0,
                2, 6, 0, 1.2, 3.5, 0,
                20, 1.8, 35, 0.7, 200);

        createFood("Poori", "Deep-fried wheat bread (2 pieces ~60g)", FoodCategory.GRAIN,
                245, 4, 30, 12, 1.5,
                0, 0, 0, 1.5, 5, 0,
                12, 1.2, 20, 0.5, 60);

        createFood("Bhatura", "Deep-fried leavened bread (1 piece ~100g)", FoodCategory.GRAIN,
                310, 7, 40, 14, 1.5,
                0, 0, 0, 1.5, 2, 0,
                20, 2.0, 20, 0.6, 70);

        createFood("Kulcha", "Stuffed or plain baked bread (1 piece ~80g)", FoodCategory.GRAIN,
                270, 7, 42, 8, 1.5,
                0, 0, 0, 0.3, 1, 0,
                30, 2.0, 18, 0.5, 60);

        createFood("Missi Roti", "Gram-flour roti (1 piece ~60g)", FoodCategory.GRAIN,
                180, 7, 24, 6, 3.0,
                5, 1, 0, 0.5, 3, 0,
                25, 1.8, 30, 0.8, 120);

        // =====================================================================
        //  NORTH INDIAN – DALS & CURRIES
        // =====================================================================

        createFood("Dal Makhani", "Black lentil & kidney-bean dal with butter (1 cup)", FoodCategory.LEGUME,
                230, 10, 28, 9, 5.0,
                20, 2, 0, 0.5, 3, 0,
                50, 3.0, 60, 1.5, 400);

        createFood("Dal Tadka", "Yellow toor dal with tempering (1 cup)", FoodCategory.LEGUME,
                180, 10, 24, 5, 5.0,
                15, 3, 0, 0.3, 2, 0,
                40, 2.8, 45, 1.2, 350);

        createFood("Rajma", "Kidney-bean curry (1 cup ~250 ml)", FoodCategory.LEGUME,
                225, 13, 35, 4, 8.0,
                10, 3, 0, 0.3, 8, 0,
                60, 3.5, 55, 1.4, 450);

        createFood("Chole", "Chickpea curry / Chana Masala (1 cup)", FoodCategory.LEGUME,
                240, 12, 36, 6, 10.0,
                15, 5, 0, 0.5, 6, 0,
                70, 4.0, 60, 2.0, 400);

        createFood("Kadhi", "Yogurt-gram flour curry with pakoras (1 cup)", FoodCategory.OTHER,
                150, 5, 12, 9, 1.0,
                10, 2, 0, 0.3, 1.5, 0.1,
                80, 0.8, 20, 0.5, 150);

        createFood("Dal Palak", "Lentils cooked with spinach (1 cup)", FoodCategory.LEGUME,
                170, 10, 22, 4, 5.5,
                200, 12, 0, 1.5, 150, 0,
                80, 3.5, 55, 1.3, 450);

        // =====================================================================
        //  NORTH INDIAN – PANEER DISHES
        // =====================================================================

        createFood("Paneer Butter Masala", "Cottage cheese in creamy tomato gravy (1 cup)", FoodCategory.DAIRY,
                370, 15, 14, 28, 2.0,
                100, 8, 0.2, 1.0, 5, 0.3,
                250, 1.5, 30, 1.5, 250);

        createFood("Palak Paneer", "Cottage cheese in spinach gravy (1 cup)", FoodCategory.DAIRY,
                290, 16, 10, 22, 3.0,
                250, 20, 0, 2.5, 300, 0.3,
                350, 4.5, 70, 1.8, 450);

        createFood("Shahi Paneer", "Paneer in rich cashew-cream gravy (1 cup)", FoodCategory.DAIRY,
                350, 14, 12, 28, 1.5,
                80, 5, 0.2, 2.0, 4, 0.3,
                280, 1.5, 35, 1.8, 200);

        createFood("Matar Paneer", "Paneer and green-pea curry (1 cup)", FoodCategory.DAIRY,
                320, 16, 16, 22, 3.0,
                80, 15, 0.1, 1.5, 20, 0.3,
                280, 2.0, 40, 1.8, 300);

        createFood("Paneer Tikka", "Grilled marinated paneer (6 pieces ~150g)", FoodCategory.DAIRY,
                280, 18, 8, 20, 1.5,
                60, 10, 0.1, 1.0, 3, 0.3,
                300, 1.0, 25, 1.5, 200);

        createFood("Paneer Bhurji", "Scrambled paneer with spices (1 cup)", FoodCategory.DAIRY,
                330, 18, 8, 26, 1.5,
                60, 12, 0.1, 1.0, 8, 0.3,
                300, 1.5, 30, 1.5, 200);

        // =====================================================================
        //  NORTH INDIAN – VEGETABLE CURRIES
        // =====================================================================

        createFood("Aloo Gobi", "Potato-cauliflower dry curry (1 cup)", FoodCategory.VEGETABLE,
                180, 5, 22, 8, 4.0,
                30, 40, 0, 1.0, 20, 0,
                40, 1.5, 30, 0.6, 350);

        createFood("Aloo Matar", "Potato and green-pea curry (1 cup)", FoodCategory.VEGETABLE,
                190, 6, 25, 7, 4.0,
                40, 15, 0, 0.8, 20, 0,
                30, 1.5, 30, 0.8, 300);

        createFood("Baingan Bharta", "Smoky mashed eggplant (1 cup)", FoodCategory.VEGETABLE,
                160, 4, 15, 10, 5.0,
                20, 8, 0, 0.5, 4, 0,
                25, 1.5, 25, 0.5, 300);

        createFood("Bhindi Masala", "Okra stir-fry with spices (1 cup)", FoodCategory.VEGETABLE,
                150, 4, 16, 8, 4.5,
                50, 18, 0, 0.5, 40, 0,
                80, 1.5, 45, 0.7, 350);

        createFood("Mixed Veg Curry", "Seasonal vegetables in gravy (1 cup)", FoodCategory.VEGETABLE,
                170, 5, 18, 8, 4.0,
                80, 15, 0, 1.0, 25, 0,
                50, 1.5, 35, 0.7, 350);

        createFood("Malai Kofta", "Paneer-potato dumplings in cream gravy (1 serving)", FoodCategory.OTHER,
                380, 12, 20, 28, 2.5,
                80, 5, 0, 2.0, 6, 0.2,
                200, 2.0, 40, 1.5, 250);

        // =====================================================================
        //  NORTH INDIAN – NON-VEG
        // =====================================================================

        createFood("Butter Chicken", "Chicken in creamy tomato-butter gravy (1 cup)", FoodCategory.PROTEIN,
                440, 28, 12, 30, 1.5,
                120, 6, 0.2, 2.0, 8, 0.5,
                60, 2.5, 35, 2.5, 350);

        createFood("Tandoori Chicken", "Yogurt-marinated roasted chicken (1 leg ~150g)", FoodCategory.PROTEIN,
                260, 30, 5, 13, 0.5,
                40, 3, 0.1, 0.8, 3, 0.8,
                25, 2.0, 30, 3.0, 300);

        createFood("Rogan Josh", "Kashmiri lamb curry (1 cup)", FoodCategory.PROTEIN,
                350, 25, 8, 24, 1.5,
                80, 5, 0, 1.5, 8, 2.5,
                30, 3.5, 30, 4.0, 350);

        createFood("Chicken Biryani", "Spiced basmati rice with chicken (1 plate ~350g)", FoodCategory.GRAIN,
                490, 22, 58, 18, 2.0,
                30, 4, 0, 1.0, 5, 0.4,
                40, 2.5, 50, 2.0, 300);

        createFood("Veg Biryani", "Spiced basmati rice with vegetables (1 plate ~300g)", FoodCategory.GRAIN,
                350, 8, 55, 10, 3.5,
                50, 8, 0, 1.0, 15, 0,
                35, 2.0, 40, 1.2, 250);

        createFood("Mutton Keema", "Spiced minced mutton curry (1 cup)", FoodCategory.PROTEIN,
                380, 26, 6, 28, 1.0,
                30, 3, 0, 1.0, 5, 2.5,
                25, 3.5, 25, 4.5, 320);

        createFood("Fish Curry", "Indian-style fish in tomato-onion gravy (1 cup)", FoodCategory.PROTEIN,
                220, 24, 8, 10, 1.5,
                40, 6, 5.0, 1.0, 3, 1.5,
                50, 1.5, 35, 1.0, 380);

        createFood("Egg Curry", "Boiled eggs in onion-tomato masala (2 eggs, 1 cup)", FoodCategory.PROTEIN,
                250, 14, 10, 17, 1.5,
                100, 5, 1.1, 1.0, 3, 1.2,
                60, 2.0, 15, 1.2, 200);

        // =====================================================================
        //  NORTH INDIAN – RICE DISHES
        // =====================================================================

        createFood("Jeera Rice", "Cumin-tempered basmati rice (1 cup)", FoodCategory.GRAIN,
                220, 4, 40, 5, 1.0,
                0, 0, 0, 0.2, 1, 0,
                10, 1.0, 15, 0.5, 60);

        createFood("Pulao", "Vegetable pilaf rice (1 cup)", FoodCategory.GRAIN,
                250, 5, 42, 7, 2.0,
                30, 5, 0, 0.5, 5, 0,
                20, 1.2, 25, 0.7, 150);

        // =====================================================================
        //  NORTH INDIAN – SNACKS
        // =====================================================================

        createFood("Samosa", "Deep-fried potato-pea pastry (1 piece ~80g)", FoodCategory.SNACK,
                260, 4, 28, 15, 2.0,
                5, 6, 0, 2.0, 10, 0,
                15, 1.2, 20, 0.4, 150);

        createFood("Pakora", "Gram-flour fritters – onion / veg (4 pieces ~100g)", FoodCategory.SNACK,
                220, 5, 20, 14, 2.5,
                40, 10, 0, 1.5, 8, 0,
                30, 1.5, 25, 0.6, 150);

        createFood("Aloo Tikki", "Spiced potato patties (2 pieces ~120g)", FoodCategory.SNACK,
                250, 4, 32, 12, 2.5,
                5, 8, 0, 1.0, 5, 0,
                15, 1.2, 25, 0.5, 300);

        createFood("Pav Bhaji", "Mashed veg curry with buttered bun (1 serving)", FoodCategory.SNACK,
                400, 10, 50, 18, 5.0,
                80, 20, 0, 2.0, 15, 0,
                50, 2.5, 40, 1.2, 400);

        createFood("Chole Bhature", "Chickpea curry with fried bread (1 plate)", FoodCategory.LEGUME,
                450, 14, 50, 22, 6.0,
                15, 5, 0, 2.0, 8, 0,
                60, 4.0, 50, 1.8, 350);

        createFood("Misal Pav", "Sprouted moth curry with bread (1 serving)", FoodCategory.LEGUME,
                380, 14, 45, 16, 7.0,
                25, 10, 0, 1.5, 8, 0,
                50, 3.5, 50, 1.5, 400);

        createFood("Kachori", "Spiced dal-stuffed fried bread (1 piece ~60g)", FoodCategory.SNACK,
                240, 5, 26, 13, 2.0,
                5, 1, 0, 1.5, 3, 0,
                18, 1.5, 20, 0.5, 100);

        // =====================================================================
        //  NORTH INDIAN – ACCOMPANIMENTS
        // =====================================================================

        createFood("Raita", "Yogurt with cucumber & spices (1 cup)", FoodCategory.DAIRY,
                70, 4, 6, 3, 0.5,
                20, 4, 0.1, 0.1, 1, 0.3,
                130, 0.3, 15, 0.5, 180);

        createFood("Vegetable Korma", "Mixed veg in cashew-coconut gravy (1 cup)", FoodCategory.VEGETABLE,
                280, 6, 20, 20, 4.0,
                100, 15, 0, 2.0, 20, 0,
                60, 2.0, 40, 1.0, 350);

        // =====================================================================
        //  NORTH INDIAN – BREAKFAST ITEMS
        // =====================================================================

        createFood("Poha", "Flattened rice with peanuts & turmeric (1 plate ~200g)", FoodCategory.GRAIN,
                250, 5, 40, 8, 2.0,
                10, 5, 0, 0.5, 2, 0,
                20, 5.0, 25, 0.8, 120);

        createFood("Sabudana Khichdi", "Tapioca pearls with peanuts & potato (1 plate ~200g)", FoodCategory.GRAIN,
                310, 4, 50, 10, 1.5,
                5, 3, 0, 1.0, 2, 0,
                20, 1.0, 10, 0.4, 150);

        createFood("Puri Bhaji", "Fried puri with potato curry (2 puri + sabzi)", FoodCategory.GRAIN,
                350, 7, 42, 17, 4.0,
                25, 15, 0, 2.0, 8, 0,
                25, 2.0, 30, 0.7, 250);

        createFood("Besan Chilla", "Gram-flour savoury pancake (2 pieces ~120g)", FoodCategory.LEGUME,
                200, 10, 20, 9, 3.5,
                30, 6, 0, 0.5, 5, 0,
                35, 2.0, 40, 1.0, 250);

        createFood("Moong Dal Chilla", "Green-gram pancake (2 pieces ~120g)", FoodCategory.LEGUME,
                180, 12, 22, 5, 3.0,
                15, 4, 0, 0.3, 4, 0,
                30, 2.5, 40, 1.0, 280);

        // =====================================================================
        //  SOUTH INDIAN – BREAKFAST / TIFFIN
        // =====================================================================

        createFood("Idli", "Steamed rice-lentil cakes (2 pieces ~120g)", FoodCategory.GRAIN,
                130, 4, 25, 1, 1.5,
                0, 0, 0, 0.1, 0.5, 0,
                15, 1.5, 20, 0.6, 80);

        createFood("Plain Dosa", "Fermented rice-lentil crepe (1 piece ~110g)", FoodCategory.GRAIN,
                165, 4, 27, 5, 1.0,
                0, 0, 0, 0.3, 1, 0,
                12, 1.5, 20, 0.5, 100);

        createFood("Masala Dosa", "Dosa stuffed with spiced potato (1 piece ~200g)", FoodCategory.GRAIN,
                300, 6, 40, 13, 2.5,
                10, 8, 0, 0.8, 3, 0,
                25, 2.0, 30, 0.7, 250);

        createFood("Rava Dosa", "Semolina-based crispy dosa (1 piece ~120g)", FoodCategory.GRAIN,
                200, 4, 28, 8, 1.0,
                5, 2, 0, 0.3, 1, 0,
                15, 1.0, 15, 0.4, 80);

        createFood("Medu Vada", "Deep-fried urad-dal doughnuts (2 pieces ~120g)", FoodCategory.LEGUME,
                280, 10, 25, 16, 3.0,
                5, 2, 0, 1.5, 3, 0,
                30, 2.5, 35, 1.0, 250);

        createFood("Uttapam", "Thick rice-lentil pancake with veg toppings (1 piece ~150g)", FoodCategory.GRAIN,
                200, 5, 30, 7, 2.0,
                20, 8, 0, 0.5, 5, 0,
                20, 1.5, 25, 0.6, 150);

        createFood("Upma", "Semolina cooked with vegetables & mustard (1 cup ~200g)", FoodCategory.GRAIN,
                210, 5, 32, 7, 2.5,
                10, 3, 0, 0.4, 3, 0,
                20, 1.5, 30, 0.7, 120);

        createFood("Ven Pongal", "Rice-moong dal with pepper & ghee (1 cup ~200g)", FoodCategory.GRAIN,
                240, 6, 35, 8, 2.0,
                5, 1, 0, 0.3, 2, 0,
                25, 1.5, 30, 0.8, 150);

        createFood("Appam", "Fermented rice-coconut hoppers (1 piece ~100g)", FoodCategory.GRAIN,
                120, 2, 24, 2, 0.5,
                0, 0, 0, 0.1, 0.2, 0,
                8, 0.5, 10, 0.3, 50);

        createFood("Puttu", "Steamed rice-flour & coconut cylinder (1 piece ~150g)", FoodCategory.GRAIN,
                230, 4, 40, 6, 3.0,
                0, 0, 0, 0.2, 0.3, 0,
                10, 1.0, 25, 0.5, 120);

        createFood("Pesarattu", "Green-gram dosa, Andhra-style (1 piece ~120g)", FoodCategory.LEGUME,
                150, 8, 22, 3, 3.0,
                10, 5, 0, 0.3, 5, 0,
                20, 2.0, 30, 0.8, 200);

        createFood("Idiyappam", "String hoppers / rice noodle nests (2 pieces ~100g)", FoodCategory.GRAIN,
                130, 2, 28, 1, 0.5,
                0, 0, 0, 0.1, 0.2, 0,
                8, 0.5, 10, 0.3, 40);

        createFood("Paniyaram", "Rice-lentil batter dumplings (4 pieces ~120g)", FoodCategory.GRAIN,
                180, 4, 28, 6, 1.5,
                5, 2, 0, 0.3, 1, 0,
                15, 1.0, 18, 0.5, 90);

        // =====================================================================
        //  SOUTH INDIAN – CURRIES & SIDES
        // =====================================================================

        createFood("Sambhar", "Lentil-vegetable stew with tamarind (1 cup ~250 ml)", FoodCategory.LEGUME,
                130, 7, 18, 3, 4.0,
                40, 10, 0, 0.5, 10, 0,
                40, 2.5, 35, 0.8, 350);

        createFood("Rasam", "Spiced tamarind-tomato broth (1 cup ~250 ml)", FoodCategory.OTHER,
                50, 2, 8, 1, 1.5,
                20, 15, 0, 0.2, 5, 0,
                20, 1.0, 15, 0.3, 200);

        createFood("Coconut Chutney", "Ground coconut chutney (2 tbsp ~30g)", FoodCategory.OTHER,
                50, 1, 3, 4, 1.0,
                0, 1, 0, 0.1, 0.2, 0,
                5, 0.3, 8, 0.2, 60);

        createFood("Avial", "Mixed vegetables in coconut-yogurt sauce (1 cup)", FoodCategory.VEGETABLE,
                160, 4, 15, 10, 4.0,
                80, 15, 0, 0.8, 20, 0,
                50, 1.5, 35, 0.6, 300);

        createFood("Kootu", "Lentil and vegetable stew with coconut (1 cup)", FoodCategory.LEGUME,
                150, 7, 18, 5, 4.0,
                50, 10, 0, 0.5, 15, 0,
                40, 2.0, 35, 0.8, 300);

        createFood("Poriyal / Thoran", "Dry stir-fried vegetables with coconut (1 cup ~150g)", FoodCategory.VEGETABLE,
                120, 3, 10, 8, 4.0,
                100, 20, 0, 0.5, 60, 0,
                45, 1.5, 25, 0.5, 250);

        createFood("Kuzhambu", "Tangy tamarind-based vegetable curry (1 cup)", FoodCategory.VEGETABLE,
                140, 3, 14, 8, 3.0,
                30, 10, 0, 0.5, 8, 0,
                30, 1.5, 25, 0.5, 250);

        createFood("Mor Kuzhambu", "Yogurt-based vegetable curry (1 cup)", FoodCategory.DAIRY,
                110, 4, 12, 5, 1.5,
                15, 3, 0.1, 0.2, 2, 0.2,
                100, 0.5, 18, 0.4, 200);

        // =====================================================================
        //  SOUTH INDIAN – RICE VARIETIES
        // =====================================================================

        createFood("Bisibelebath", "Spiced rice with lentils & vegetables (1 cup ~250g)", FoodCategory.GRAIN,
                320, 10, 48, 10, 4.0,
                30, 5, 0, 0.5, 8, 0,
                35, 2.5, 45, 1.2, 300);

        createFood("Lemon Rice", "Tangy turmeric-lemon rice (1 cup ~200g)", FoodCategory.GRAIN,
                250, 4, 42, 7, 1.5,
                5, 10, 0, 0.3, 2, 0,
                15, 1.0, 20, 0.6, 100);

        createFood("Curd Rice", "Yogurt rice with tempering (1 cup ~250g)", FoodCategory.GRAIN,
                210, 6, 35, 5, 0.5,
                15, 1, 0.1, 0.1, 0.5, 0.3,
                120, 0.5, 20, 0.7, 180);

        createFood("Tamarind Rice", "Tangy tamarind-spiced rice (1 cup ~200g)", FoodCategory.GRAIN,
                270, 4, 45, 8, 2.0,
                10, 3, 0, 0.3, 2, 0,
                20, 1.5, 25, 0.6, 150);

        createFood("Coconut Rice", "Rice cooked with grated coconut (1 cup ~200g)", FoodCategory.GRAIN,
                280, 4, 40, 12, 2.5,
                0, 1, 0, 0.3, 0.5, 0,
                15, 1.0, 20, 0.5, 130);

        createFood("Tomato Rice", "Rice with spiced tomato masala (1 cup ~200g)", FoodCategory.GRAIN,
                240, 4, 40, 7, 2.0,
                40, 12, 0, 0.5, 5, 0,
                20, 1.2, 20, 0.6, 200);

        // =====================================================================
        //  SOUTH INDIAN – NON-VEG
        // =====================================================================

        createFood("Chicken Chettinad", "Spicy Chettinad chicken curry (1 cup)", FoodCategory.PROTEIN,
                350, 28, 8, 22, 1.5,
                40, 5, 0, 1.0, 5, 0.5,
                30, 2.5, 30, 2.5, 350);

        createFood("Kerala Fish Curry", "Fish in coconut-tamarind gravy (1 cup)", FoodCategory.PROTEIN,
                230, 22, 8, 12, 1.5,
                30, 5, 4.0, 1.0, 3, 1.5,
                45, 1.5, 35, 1.0, 380);

        createFood("Prawn Masala", "South Indian-style prawn curry (1 cup)", FoodCategory.PROTEIN,
                210, 24, 8, 9, 1.0,
                30, 5, 0.5, 1.0, 3, 1.2,
                80, 2.0, 40, 1.5, 300);

        // =====================================================================
        //  COMMON INDIAN BEVERAGES
        // =====================================================================

        createFood("Masala Chai", "Spiced milk tea (1 cup ~200 ml)", FoodCategory.BEVERAGE,
                100, 3, 14, 3.5, 0,
                20, 0, 0.2, 0, 0.2, 0.2,
                80, 0.5, 10, 0.3, 120);

        createFood("Filter Coffee", "South Indian filter coffee with milk (1 cup ~150 ml)", FoodCategory.BEVERAGE,
                90, 3, 10, 4, 0,
                15, 0, 0.2, 0, 0.2, 0.2,
                80, 0.1, 10, 0.2, 130);

        createFood("Sweet Lassi", "Sweetened yogurt smoothie (1 glass ~250 ml)", FoodCategory.BEVERAGE,
                170, 6, 25, 5, 0,
                30, 2, 0.5, 0.1, 0.5, 0.5,
                180, 0.2, 18, 0.6, 230);

        createFood("Mango Lassi", "Yogurt smoothie with mango (1 glass ~250 ml)", FoodCategory.BEVERAGE,
                200, 5, 32, 5, 1.0,
                50, 15, 0.5, 0.5, 1, 0.4,
                150, 0.3, 18, 0.5, 250);

        createFood("Chaas / Buttermilk", "Spiced thin buttermilk (1 glass ~250 ml)", FoodCategory.BEVERAGE,
                45, 3, 5, 1.5, 0,
                10, 1, 0.1, 0, 0.3, 0.2,
                100, 0.1, 12, 0.3, 150);

        createFood("Jaljeera", "Cumin-mint cooler (1 glass ~250 ml)", FoodCategory.BEVERAGE,
                30, 0.5, 7, 0.2, 0.5,
                5, 5, 0, 0.1, 2, 0,
                10, 0.5, 5, 0.2, 60);

        // =====================================================================
        //  INDIAN DESSERTS & SWEETS
        // =====================================================================

        createFood("Kheer", "Rice pudding with cardamom & nuts (1 bowl ~150g)", FoodCategory.DESSERT,
                250, 6, 35, 10, 0.5,
                40, 1, 0.3, 0.3, 0.5, 0.3,
                150, 0.5, 20, 0.7, 180);

        createFood("Payasam", "South Indian vermicelli / sago kheer (1 bowl ~150g)", FoodCategory.DESSERT,
                260, 5, 38, 10, 0.5,
                35, 1, 0.2, 0.3, 0.5, 0.2,
                130, 0.5, 20, 0.5, 170);

        createFood("Gajar Ka Halwa", "Carrot halwa with ghee & nuts (1 bowl ~150g)", FoodCategory.DESSERT,
                290, 5, 32, 16, 2.0,
                300, 4, 0.1, 1.0, 10, 0.1,
                120, 0.8, 20, 0.5, 200);

        createFood("Gulab Jamun", "Deep-fried milk dumplings in syrup (2 pieces ~80g)", FoodCategory.DESSERT,
                300, 4, 40, 14, 0.5,
                20, 0, 0.1, 0.3, 0.5, 0.1,
                50, 0.5, 10, 0.3, 80);

        createFood("Jalebi", "Deep-fried syrup-soaked spirals (3 pieces ~100g)", FoodCategory.DESSERT,
                380, 2, 55, 17, 0.5,
                5, 0, 0, 1.0, 2, 0,
                15, 0.5, 8, 0.2, 30);

        createFood("Mysore Pak", "Gram-flour & ghee fudge (1 piece ~50g)", FoodCategory.DESSERT,
                260, 3, 22, 18, 1.0,
                20, 0, 0, 1.0, 1, 0,
                20, 0.5, 15, 0.4, 80);

        createFood("Rasgulla", "Spongy cottage-cheese balls in syrup (2 pieces ~80g)", FoodCategory.DESSERT,
                185, 4, 36, 3, 0,
                10, 0, 0, 0.1, 0.2, 0.1,
                40, 0.2, 5, 0.3, 30);

        createFood("Laddu", "Besan or boondi laddu (1 piece ~50g)", FoodCategory.DESSERT,
                220, 4, 26, 12, 1.0,
                10, 0, 0, 0.8, 1, 0,
                25, 0.8, 15, 0.5, 80);

        createFood("Halwa (Sooji)", "Semolina halwa with ghee & dry fruits (1 serving ~100g)", FoodCategory.DESSERT,
                280, 3, 34, 15, 0.5,
                25, 0, 0.1, 0.5, 1, 0,
                20, 0.5, 10, 0.3, 50);

        createFood("Barfi", "Milk-based fudge with nuts (1 piece ~40g)", FoodCategory.DESSERT,
                180, 3, 20, 10, 0.3,
                15, 0, 0.1, 0.3, 0.3, 0.1,
                60, 0.3, 10, 0.3, 60);

        // =====================================================================
        //  COMMON INDIAN STAPLES
        // =====================================================================

        createFood("Paneer (Raw)", "Fresh cottage cheese (100g)", FoodCategory.DAIRY,
                265, 18, 3.6, 20, 0,
                50, 0, 0.1, 0.2, 0.5, 0.8,
                480, 0.2, 8, 1.0, 100);

        createFood("Ghee", "Clarified butter (1 tbsp ~14g)", FoodCategory.OTHER,
                120, 0, 0, 14, 0,
                108, 0, 0.1, 0.4, 1.2, 0,
                0, 0, 0, 0, 0);

        createFood("Curd / Dahi", "Plain homemade yogurt (1 cup ~200g)", FoodCategory.DAIRY,
                100, 7, 8, 4.5, 0,
                25, 1, 0.1, 0.1, 0.4, 0.5,
                180, 0.2, 18, 0.8, 260);

        createFood("Pickle (Achar)", "Mixed Indian pickle (1 tbsp ~15g)", FoodCategory.OTHER,
                30, 0.3, 3, 2, 0.5,
                15, 2, 0, 0.3, 2, 0,
                5, 0.3, 3, 0.1, 20);

        createFood("Papad / Papadum", "Roasted lentil crisp (2 pieces ~30g)", FoodCategory.SNACK,
                95, 5, 12, 3, 1.5,
                0, 0, 0, 0.2, 1, 0,
                15, 1.0, 15, 0.5, 100);
    }

    private void createFood(String name, String description, FoodCategory category,
                           double calories, double protein, double carbs, double fat, double fiber,
                           double vitA, double vitC, double vitD, double vitE, double vitK, double vitB12,
                           double calcium, double iron, double magnesium, double zinc, double potassium) {
        // Create food item
        FoodItem food = new FoodItem();
        food.setName(name);
        food.setDescription(description);
        food.setCategory(category);
        food.setIsActive(true);
        food.setIsCustom(false);
        food.setVersion(1);
        food = foodItemRepository.save(food);

        // Create nutrient profile with real values
        NutrientProfile profile = new NutrientProfile();
        profile.setFoodItem(food);
        profile.setServingSize(100.0);
        profile.setCalories(calories);
        profile.setProtein(protein);
        profile.setCarbohydrates(carbs);
        profile.setFat(fat);
        profile.setFiber(fiber);
        profile.setVitaminA(vitA);
        profile.setVitaminC(vitC);
        profile.setVitaminD(vitD);
        profile.setVitaminE(vitE);
        profile.setVitaminK(vitK);
        profile.setVitaminB12(vitB12);
        profile.setCalcium(calcium);
        profile.setIron(iron);
        profile.setMagnesium(magnesium);
        profile.setZinc(zinc);
        profile.setPotassium(potassium);

        nutrientProfileRepository.save(profile);
    }
}
