package com.ecoverse.demo.util;

import com.ecoverse.demo.entity.*;
import com.ecoverse.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TreeLevelRepository treeLevelRepository;

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private WeeklyMissionRepository weeklyMissionRepository;

    @Autowired
    private SeasonalEventRepository seasonalEventRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizOptionRepository quizOptionRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedTreeLevels();
        seedShopItems();
        seedWeeklyMissions();
        seedSeasonalEvents();
        seedCoursesAndQuizzes();
        seedCommunityPosts();
    }

    private void seedTreeLevels() {
        if (treeLevelRepository.count() == 0) {
            treeLevelRepository.saveAll(Arrays.asList(
                TreeLevel.builder().level(1).stageName("Seed").xpRequired(0).imageUrl("🌱").build(),
                TreeLevel.builder().level(2).stageName("Sprout").xpRequired(200).imageUrl("🌿").build(),
                TreeLevel.builder().level(3).stageName("Sapling").xpRequired(500).imageUrl("🪴").build(),
                TreeLevel.builder().level(4).stageName("Small Tree").xpRequired(1000).imageUrl("🌳").build(),
                TreeLevel.builder().level(5).stageName("Mature Tree").xpRequired(2000).imageUrl("🌲").build(),
                TreeLevel.builder().level(6).stageName("Giant Oak").xpRequired(4000).imageUrl("👑").build()
            ));
            System.out.println("Seeded Tree Levels.");
        }
    }

    private void seedShopItems() {
        if (shopItemRepository.count() == 0) {
            shopItemRepository.saveAll(Arrays.asList(
                // Trees
                ShopItem.builder().itemKey("tree_oak").name("Oak Tree").description("A sturdy oak tree for your garden, offering shade and wildlife shelter.").price(150).category("Trees").imageUrl("🌳").build(),
                ShopItem.builder().itemKey("tree_bamboo").name("Bamboo Grove").description("Fast-growing bamboo shoots, perfect for windbreaks and fencing.").price(100).category("Trees").imageUrl("🎋").build(),
                ShopItem.builder().itemKey("tree_cherry").name("Cherry Blossom").description("A beautiful flowering tree that sheds pink petals during spring.").price(200).category("Trees").imageUrl("🌸").build(),
                
                // Flowers
                ShopItem.builder().itemKey("flower_sunflower").name("Sunflower Patch").description("Bright yellow sunflowers that follow the sun and attract bees.").price(80).category("Flowers").imageUrl("🌻").build(),
                ShopItem.builder().itemKey("flower_rose").name("Rose Bush").description("Classic red roses that add color and premium fragrance.").price(70).category("Flowers").imageUrl("🌹").build(),
                ShopItem.builder().itemKey("flower_tulip").name("Tulip Row").description("Colorful Dutch tulips that bloom beautifully in the breeze.").price(90).category("Flowers").imageUrl("🌷").build(),

                // Animals
                ShopItem.builder().itemKey("animal_butterfly").name("Monarch Butterfly").description("Attract colorful monarch butterflies that flutter around your garden.").price(120).category("Animals").imageUrl("🦋").build(),
                ShopItem.builder().itemKey("animal_bird").name("Blue Bird").description("A happy blue bird that nests in your trees and sings morning tunes.").price(150).category("Animals").imageUrl("🐦").build(),

                // Decorations
                ShopItem.builder().itemKey("dec_bench").name("Garden Bench").description("A rustic wooden bench where you can sit and enjoy your eco garden.").price(250).category("Decorations").imageUrl("🪑").build(),
                ShopItem.builder().itemKey("dec_rainbow").name("Rainbow Aura").description("A beautiful rainbow decoration spanning across the garden sky.").price(500).category("Decorations").imageUrl("🌈").build(),
                
                // Animated Toys (Category: Decorations)
                ShopItem.builder().itemKey("toy_windmill").name("Mini Windmill Toy").description("An animated windmill toy that spins endlessly in the breeze.").price(150).category("Decorations").imageUrl("🎡").build(),
                ShopItem.builder().itemKey("toy_solar_train").name("Eco Solar Train").description("A cute solar-powered wooden train that rolls back and forth.").price(200).category("Decorations").imageUrl("🚂").build(),
                ShopItem.builder().itemKey("toy_solar_robot").name("Solar Robot Toy").description("A friendly solar-powered robot that waves its hands cheerfully.").price(180).category("Decorations").imageUrl("🤖").build(),
                ShopItem.builder().itemKey("toy_drinking_bird").name("Drinking Bird Toy").description("A classic dipping bird toy that tilts forward and back.").price(120).category("Decorations").imageUrl("🐤").build(),
                ShopItem.builder().itemKey("toy_fountain").name("Mini Eco Fountain").description("A solar-powered mini fountain that ripples water dynamically.").price(160).category("Decorations").imageUrl("⛲").build(),
                ShopItem.builder().itemKey("toy_bubble_machine").name("Solar Bubble Blower").description("A solar-powered toy that blows bubbles into the garden breeze.").price(140).category("Decorations").imageUrl("🫧").build(),
                ShopItem.builder().itemKey("toy_kite").name("Wind Flyer Kite").description("A colorful eco-friendly kite flying high in the garden sky.").price(110).category("Decorations").imageUrl("🪁").build(),

                // Garden Items
                ShopItem.builder().itemKey("garden_windmill").name("Windmill").description("Clean wind energy producer that powers your eco garden tools.").price(600).category("Garden Items").imageUrl("⛛").build(),
                ShopItem.builder().itemKey("garden_solar").name("Solar Panels").description("Harness solar energy to keep your garden sustainable and clean.").price(450).category("Garden Items").imageUrl("☀").build(),
                ShopItem.builder().itemKey("garden_pond").name("Small Pond").description("A small water pond home to frogs, lotuses, and water lilies.").price(350).category("Garden Items").imageUrl("⛲").build(),
                ShopItem.builder().itemKey("garden_hive").name("Bee Hive").description("Keep bees to pollinate your garden flowers and collect sweet honey.").price(300).category("Garden Items").imageUrl("🐝").build()
            ));
            System.out.println("Seeded Shop Items.");
        }
    }

    private void seedWeeklyMissions() {
        if (weeklyMissionRepository.count() == 0) {
            weeklyMissionRepository.saveAll(Arrays.asList(
                WeeklyMission.builder().title("Complete 5 quizzes").type("QUIZ").target(5).rewardXp(200).rewardCoins(100).build(),
                WeeklyMission.builder().title("Read 3 learning modules").type("MODULE").target(3).rewardXp(150).rewardCoins(80).build(),
                WeeklyMission.builder().title("Earn 500 XP").type("XP").target(500).rewardXp(250).rewardCoins(120).build(),
                WeeklyMission.builder().title("Buy 1 garden item").type("SHOP").target(1).rewardXp(100).rewardCoins(50).build()
            ));
            System.out.println("Seeded Weekly Missions.");
        }
    }

    private void seedSeasonalEvents() {
        if (seasonalEventRepository.count() == 0) {
            seasonalEventRepository.saveAll(Arrays.asList(
                SeasonalEvent.builder()
                    .title("Earth Day Celebration")
                    .description("Celebrate Earth Day by completing course modules and learning about tree conservation. Earn premium rewards!")
                    .bannerUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80")
                    .startDate(LocalDate.now().minusDays(5))
                    .endDate(LocalDate.now().plusDays(25))
                    .rewardXp(500)
                    .rewardCoins(250)
                    .badgeReward("Earth Protector")
                    .active(true)
                    .build(),
                SeasonalEvent.builder()
                    .title("Plastic Free July")
                    .description("Join global efforts to reduce single-use plastic waste. Read waste management modules to score XP.")
                    .bannerUrl("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80")
                    .startDate(LocalDate.now().minusDays(2))
                    .endDate(LocalDate.now().plusDays(28))
                    .rewardXp(600)
                    .rewardCoins(300)
                    .badgeReward("Plastic Free Legend")
                    .active(true)
                    .build()
            ));
            System.out.println("Seeded Seasonal Events.");
        }
    }

    private void seedCoursesAndQuizzes() {
        if (courseRepository.count() > 0) {
            return;
        }

        createSeededCourse(
            "Solar Energy Basics",
            "Learn how sunlight is converted into clean electricity using solar photovoltaic cells.",
            "Beginner",
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
            "Solar Pioneer",
            "Understanding Photovoltaics",
            "Solar energy is generated by converting sunlight into electricity using photovoltaic (PV) cells. When sunlight hits a PV cell, it knocks electrons free, generating an electric current. Solar panels are clean, renewable, and can be installed on rooftops to power homes sustainably.",
            new String[][] {
                {"What cells convert sunlight directly into electricity?", "Photovoltaic cells", "Thermal cells", "Nuclear cells"},
                {"Which of these is a clean, renewable energy source?", "Sunlight", "Coal", "Natural Gas"}
            }
        );

        createSeededCourse(
            "Wind Power Principles",
            "Explore how wind turbines capture kinetic energy and convert it into green power.",
            "Beginner",
            "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600",
            "Wind Starter",
            "Harnessing Kinetic Energy",
            "Wind turbines capture kinetic energy from moving air currents and convert it into mechanical power, which a generator then turns into electricity. Modern wind turbines are highly efficient and are often placed in groups called wind farms, located in open plains or offshore.",
            new String[][] {
                {"What type of energy do wind turbines capture?", "Kinetic energy", "Chemical energy", "Thermal energy"},
                {"Where are wind farms often located for maximum efficiency?", "Offshore or open plains", "Dense forests", "Deep valleys"}
            }
        );

        createSeededCourse(
            "Hydropower & Water Energy",
            "Discover how flowing water is harnessed to generate clean and reliable electricity.",
            "Beginner",
            "https://images.unsplash.com/photo-1518084888318-f7480d5b374e?w=600",
            "Hydro Cadet",
            "Water Turbines & Dams",
            "Hydropower uses flowing water—usually from a river or a reservoir behind a dam—to turn large turbines. The spinning turbine drives a generator to produce electricity. It is one of the oldest and most reliable sources of renewable energy.",
            new String[][] {
                {"What is the main source of power in a hydroelectric plant?", "Flowing water", "Steam", "Wind"},
                {"What structure is built to store water for hydropower?", "Dam", "Canal", "Aqueduct"}
            }
        );

        createSeededCourse(
            "Introduction to Recycling",
            "Master the basics of waste sorting and recycling to help protect environment resources.",
            "Beginner",
            "https://images.unsplash.com/photo-1532996127006-02d93e82b7b5?w=600",
            "Recycle Scout",
            "Waste Classification & Lifecycle",
            "Recycling involves processing used materials into new products to prevent waste of potentially useful materials. Correctly sorting paper, glass, plastic, and metal helps reduce land waste and pollution, and conserves raw materials.",
            new String[][] {
                {"Which material takes the longest to decompose in a landfill?", "Plastic", "Paper", "Orange peel"},
                {"What does the recycling symbol with three arrows represent?", "Reduce, Reuse, Recycle", "Sort, Clean, Melt", "Collect, Process, Sell"}
            }
        );

        createSeededCourse(
            "Composting at Home",
            "Turn your kitchen food scraps and organic waste into nutrient-rich organic soil.",
            "Beginner",
            "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600",
            "Compost Buddy",
            "Organic Waste Decomposition",
            "Composting is the natural process of recycling organic matter, such as leaves and food scraps, into a valuable fertilizer that can enrich soil and plants. It diverts organic waste from landfills where it would otherwise produce harmful methane gas.",
            new String[][] {
                {"Which of these can be composted?", "Vegetable peels", "Plastic bags", "Meat scraps"},
                {"What organism is highly beneficial for compost bin aeration?", "Earthworms", "Mosquitoes", "Spiders"}
            }
        );

        createSeededCourse(
            "Water Conservation Tips",
            "Learn practical ways to reduce water waste at home and protect freshwater ecosystems.",
            "Beginner",
            "https://images.unsplash.com/photo-1488330890490-c291ecf62571?w=600",
            "Water Saver",
            "Reducing Household Water Waste",
            "Water conservation refers to reducing water usage and recycling wastewater. Simple actions like using low-flow faucets, fixing leaks, and watering plants with rainwater can save thousands of liters of freshwater per year.",
            new String[][] {
                {"What is a highly effective way to conserve water in gardens?", "Drip irrigation", "Sprinklers on high", "Daily flooding"},
                {"What percentage of Earth's water is freshwater available for human use?", "Less than 1%", "About 10%", "Around 25%"}
            }
        );

        createSeededCourse(
            "Protecting Ocean Life",
            "Explore marine ecosystems and understand the impact of plastic pollution and acidification.",
            "Beginner",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
            "Ocean Protector",
            "Marine Habitats & Ocean Health",
            "Oceans cover over 70% of Earth and support diverse ecosystems. They are threatened by plastic pollution, overfishing, and rising acidity. Ocean conservation focuses on protecting marine habitats, conserving biodiversity, and reducing runoff pollution.",
            new String[][] {
                {"What is causing ocean acidification?", "Excess carbon dioxide absorption", "Oil spills", "Plastic waste"},
                {"Which habitat is known as the 'rainforest of the sea'?", "Coral Reefs", "Deep sea trenches", "Sandy beaches"}
            }
        );

        createSeededCourse(
            "Forest & Tree Ecology",
            "Understand forest ecosystems, biodiversity, and how trees act as carbon sinks.",
            "Beginner",
            "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600",
            "Forest Guardian",
            "Forest Ecosystems & Carbon Sequestration",
            "Forests house over 80% of terrestrial biodiversity and act as critical carbon sinks, absorbing greenhouse gases from the atmosphere. Deforestation threatens these benefits, causing soil erosion, habitat loss, and contributing to climate change.",
            new String[][] {
                {"What term describes a forest's role in absorbing excess CO2?", "Carbon sink", "Oxygen generator", "Greenhouse agent"},
                {"Which layer of the forest receives the most sunlight?", "Emergent layer", "Understory", "Forest floor"}
            }
        );

        createSeededCourse(
            "Single-Use Plastics",
            "Learn about the dangers of single-use plastic waste and explore reusable alternatives.",
            "Beginner",
            "https://images.unsplash.com/photo-1526951914846-7afa05b6140a?w=600",
            "Plastic Free Hero",
            "Plastic Alternatives & Microplastics",
            "Single-use plastics pose severe threats to wildlife and pollute our land and seas. Switching to reusable bags, bottles, and straws helps reduce plastic demand. Over time, plastic breaks down into microplastics, entering the food chain.",
            new String[][] {
                {"Which is a sustainable alternative to single-use plastic bags?", "Canvas bags", "Paper bags", "Polyester bags"},
                {"What are microplastics?", "Tiny plastic particles under 5mm", "A new type of packaging", "Biodegradable plastic"}
            }
        );

        createSeededCourse(
            "Sustainable Fashion Intro",
            "Analyze the impact of fast fashion and discover eco-friendly textile materials.",
            "Beginner",
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
            "Green Stylist",
            "Fast Fashion Impact & Eco Textiles",
            "Fast fashion generates huge waste and uses massive water resources. Sustainable fashion focuses on organic cotton, linen, hemp, and recycled polyester. Buying high-quality second-hand clothing also helps reduce clothing waste.",
            new String[][] {
                {"Which clothing material is biodegradable and natural?", "Organic cotton", "Polyester", "Nylon"},
                {"What practice reduces fashion waste?", "Buying high-quality second-hand clothing", "Discarding clothes after one season", "Buying cheap fast fashion"}
            }
        );

        createSeededCourse(
            "Wildlife Protection",
            "Learn about endangered species, poaching, and wildlife habitat conservation.",
            "Beginner",
            "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=600",
            "Fauna Friend",
            "Endangered Species & Habitat Loss",
            "Habitat destruction, poaching, and climate change are leading causes of wildlife endangerment. Wildlife conservation aims to protect species and their habitats, maintaining natural biodiversity and healthy food chains.",
            new String[][] {
                {"What is the main cause of species extinction today?", "Habitat loss", "Natural predators", "Volcanic eruptions"},
                {"What does an endangered status mean?", "At high risk of extinction", "Increasing population", "Safe from hunting"}
            }
        );

        createSeededCourse(
            "Air Pollution & Smog",
            "Examine particulate matter, smog, and how cities can improve air quality.",
            "Beginner",
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600",
            "Clean Air Cadet",
            "Particulate Matter & Smog Sources",
            "Smog and fine particulate matter affect respiratory health. Main sources include vehicle emissions and industrial factories. Cities can improve air quality by implementing emission standards and investing in active public transport.",
            new String[][] {
                {"What is a major contributor to urban smog?", "Vehicle emissions", "Trees releasing oxygen", "Water vapor"},
                {"What does PM2.5 refer to?", "Fine particulate matter under 2.5 micrometers", "Air pressure level", "Wind speed measurement"}
            }
        );

        createSeededCourse(
            "Geothermal Energy Intro",
            "Taps into the natural heat of Earth's core to produce clean, sustainable steam power.",
            "Intermediate",
            "https://images.unsplash.com/photo-1548678684-25bf784a9e52?w=600",
            "Thermal Explorer",
            "Earth's Internal Heat & Energy Extraction",
            "Geothermal energy taps into the natural heat of Earth's core, utilizing hot water or steam to turn power turbines. It provides a constant, reliable source of green energy, unaffected by weather changes, and is highly popular in volcanic zones like Iceland.",
            new String[][] {
                {"Where does geothermal energy come from?", "Earth's internal heat", "Solar radiation", "Ocean tides"},
                {"Which country is a world leader in geothermal energy usage?", "Iceland", "Saudi Arabia", "Brazil"}
            }
        );

        createSeededCourse(
            "Biomass & Biofuels",
            "Convert agricultural organic matter and waste into liquid clean energy fuels.",
            "Intermediate",
            "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600",
            "BioEnergy Expert",
            "Energy from Organic Matter",
            "Biomass uses organic materials like wood, crops, and waste to create biofuels. It is considered carbon-neutral because the crops absorb CO2 during growth, balancing out emissions. Common biofuels include ethanol and biodiesel.",
            new String[][] {
                {"What is biofuel primarily made from?", "Organic biomass", "Crude oil", "Coal reserves"},
                {"Which of these is a liquid biofuel?", "Ethanol", "Natural gas", "Propane"}
            }
        );

        createSeededCourse(
            "Organic Farming Methods",
            "Grow crops without synthetic pesticides, using crop rotation and natural compost.",
            "Intermediate",
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600",
            "Organic Grower",
            "Pesticide Alternatives & Biopredators",
            "Organic farming avoids synthetic pesticides and chemical fertilizers, using crop rotation, natural compost, and biological pest control. This protects soil health, keeps waterways clean, and preserves local biodiversity.",
            new String[][] {
                {"What practice is common in organic farming?", "Crop rotation", "Synthetic chemical spraying", "Monoculture planting"},
                {"Which insect is a natural predator of crop pests?", "Ladybug", "Aphid", "Locust"}
            }
        );

        createSeededCourse(
            "Green Building Materials",
            "Design eco-friendly buildings with renewable materials and cool roof technology.",
            "Intermediate",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600",
            "Green Architect",
            "Sustainable Construction & Materials",
            "Green buildings use materials like bamboo, recycled metal, and sheep's wool insulation to minimize environmental impact. Cool roofs reflect sunlight to reduce heat absorption, lowering energy usage in warm climates.",
            new String[][] {
                {"Which material is highly renewable and used for eco flooring?", "Bamboo", "Hardwood oak", "Concrete"},
                {"What is the purpose of cool roofs?", "To reflect sunlight and reduce heat absorption", "To collect rainwater", "To look modern"}
            }
        );

        createSeededCourse(
            "Eco-Friendly Transit",
            "Explore active transit like cycling and public transportation to reduce emissions.",
            "Intermediate",
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600",
            "Clean Commuter",
            "Electric and Active Transport Systems",
            "Electric cars, cycling, and public transit reduce carbon footprints in cities. Moving away from fossil-fueled personal vehicles improves urban air quality and significantly cuts per-capita greenhouse gas emissions.",
            new String[][] {
                {"Which transit mode has zero tailpipe emissions?", "Bicycling", "Diesel bus", "Hybrid car"},
                {"What is a primary benefit of public transit?", "Reduced traffic congestion and per-capita emissions", "Higher speeds", "Personal convenience"}
            }
        );

        createSeededCourse(
            "Biodiversity & Food Webs",
            "Learn how keystone species maintain ecological balance and food web stability.",
            "Intermediate",
            "https://images.unsplash.com/photo-1535268647977-a403b69fc757?w=600",
            "Eco Balance Master",
            "Ecosystem Balance & Keystone Species",
            "Every organism plays a role in food webs. Keystone species maintain ecosystem balance; if removed, the entire habitat can degrade. Biodiversity measures the variety of life in an ecosystem, reflecting its stability.",
            new String[][] {
                {"What is a keystone species?", "A species that has a disproportionate effect on its environment", "The largest animal in a habitat", "An invasive pest"},
                {"What does biodiversity measure?", "Variety of life in an ecosystem", "Total weight of plants", "Number of trees"}
            }
        );

        createSeededCourse(
            "Urban Forestry Benefits",
            "Understand how urban trees cool cities, manage stormwater, and filter smog.",
            "Intermediate",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600",
            "Urban Arborist",
            "City Trees & Canopies",
            "Urban trees reduce the heat island effect by providing shade and cooling through evapotranspiration. They filter air pollutants and absorb stormwater, preventing flooding and reducing urban runoff.",
            new String[][] {
                {"What is the urban heat island effect?", "Cities being warmer than surrounding rural areas", "Global warming trends", "Forest fires near cities"},
                {"How do trees help manage urban stormwater?", "By absorbing water through roots and foliage", "By blocking sewers", "By evaporating instantly"}
            }
        );

        createSeededCourse(
            "Soil Erosion Control",
            "Protect nutrient-rich topsoil through terrace farming, windbreaks, and cover crops.",
            "Intermediate",
            "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=600",
            "Soil Safeguard",
            "Preventing Land Degradation",
            "Planting cover crops, terrace farming, and windbreaks protect nutrient-rich topsoil from wind and rain erosion. Deforestation and overgrazing accelerate soil erosion, leading to desertification and agricultural decline.",
            new String[][] {
                {"What is a main cause of soil erosion?", "Deforestation and overgrazing", "Composting", "Organic farming"},
                {"What technique prevents erosion on steep slopes?", "Terrace farming", "Deep plowing", "Monoculturing"}
            }
        );

        createSeededCourse(
            "Smart Power Grids",
            "Learn how digital two-way grids manage electricity and integrate solar/wind power.",
            "Advanced",
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600",
            "Grid Specialist",
            "Advanced Electrical Grids & Smart Meters",
            "Smart grids use digital communication to manage electricity distribution dynamically, balancing power generation from solar and wind with real-time consumer demand. This increases grid reliability and reduces energy waste.",
            new String[][] {
                {"What makes a power grid smart?", "Two-way digital communication and automation", "High voltage lines", "Burning clean coal"},
                {"How do smart grids help renewable energy?", "By balancing fluctuating solar and wind supply", "By storing wind physically", "By making solar panels cheaper"}
            }
        );

        createSeededCourse(
            "Carbon Capture Tech",
            "Remove industrial CO2 emissions directly from the air and store them underground.",
            "Advanced",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
            "Carbon Conqueror",
            "Direct Air Capture & Carbon Storage",
            "Carbon Capture and Storage (CCS) technologies remove CO2 emissions from industrial sources or directly from the air. Captured carbon dioxide is compressed and stored deep underground in geological rock formations, preventing greenhouse warming.",
            new String[][] {
                {"What does CCS stand for?", "Carbon Capture and Storage", "Clean Coal Solutions", "Climate Control System"},
                {"Where is captured carbon dioxide often stored?", "Deep underground rock formations", "Plastic bottles", "Atmospheric balloons"}
            }
        );

        createSeededCourse(
            "Permaculture Principles",
            "Design sustainable human habitats modeled after natural ecosystems.",
            "Advanced",
            "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600",
            "Permaculture Sage",
            "Designing with Nature & Plant Guilds",
            "Permaculture is a design philosophy modeled on natural ecosystems, emphasizing cycle regeneration and zero waste. One key concept is plant guilds—grouping mutually beneficial plants together (e.g., nitrogen fixers and climbers) to maximize productivity.",
            new String[][] {
                {"What is a core permaculture principle?", "Observe and interact with nature", "Maximized chemical input", "Monoculture scaling"},
                {"What is a guild in permaculture?", "A group of mutually beneficial plants grown together", "An association of organic farmers", "A tool classification"}
            }
        );

        createSeededCourse(
            "Glacier Melting & Climate",
            "Examine the albedo effect, rising sea levels, and changing ocean currents.",
            "Advanced",
            "https://images.unsplash.com/photo-1520315342629-6ea920342047?w=600",
            "Glacier Guardian",
            "Albedo Effect & Sea Level Rise",
            "Melting glaciers reduce the albedo effect (reflection of solar radiation), causing Earth's oceans to absorb more heat and accelerate global warming. Melting land ice is also the primary driver of rising sea levels worldwide.",
            new String[][] {
                {"What is the albedo effect?", "The reflectivity of Earth's surface", "The warming of ocean currents", "The speed of ice melting"},
                {"What is a major consequence of melting land glaciers?", "Sea level rise", "Freshwater flooding in deserts", "Increased polar ice"}
            }
        );

        createSeededCourse(
            "Eco-Tourism & Policy",
            "Understand carbon tax policies and traveling sustainably to conserve nature.",
            "Advanced",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600",
            "Eco Ambassador",
            "Sustainable Travel & Carbon Taxing",
            "Eco-tourism minimizes travel impact, supports local economies, and funds conservation efforts. Globally, carbon taxing and cap-and-trade policies incentivize businesses and travelers to reduce emissions and invest in green projects.",
            new String[][] {
                {"What is a key objective of eco-tourism?", "Supporting local conservation and communities", "Building luxury resorts", "Increasing tourist numbers"},
                {"Which policy directly taxes carbon emissions?", "Carbon taxing or cap-and-trade", "Fossil fuel subsidies", "Tariff reductions"}
            }
        );

        System.out.println("Seeded 25 courses and quizzes successfully!");
    }

    private void createSeededCourse(
            String title, String desc, String diff, String imgUrl, String badge,
            String lessonTitle, String lessonContent,
            String[][] questionsAndAnswers) {
            
        Course course = Course.builder()
                .title(title)
                .description(desc)
                .difficulty(diff)
                .imageUrl(imgUrl)
                .badgeReward(badge)
                .build();
        course = courseRepository.save(course);
        
        Lesson lesson = Lesson.builder()
                .title(lessonTitle)
                .content(lessonContent)
                .sequence(1)
                .course(course)
                .build();
        lessonRepository.save(lesson);
        
        Quiz quiz = Quiz.builder()
                .course(course)
                .xpReward(100)
                .build();
        quiz = quizRepository.save(quiz);
        
        for (String[] qa : questionsAndAnswers) {
            String questionText = qa[0];
            String correctOpt = qa[1];
            String[] otherOpts = Arrays.copyOfRange(qa, 2, qa.length);
            
            QuizQuestion question = QuizQuestion.builder()
                    .questionText(questionText)
                    .quiz(quiz)
                    .build();
            question = quizQuestionRepository.save(question);
            
            QuizOption correctOption = QuizOption.builder()
                    .optionText(correctOpt)
                    .isCorrect(true)
                    .question(question)
                    .build();
            quizOptionRepository.save(correctOption);
            
            for (String otherOpt : otherOpts) {
                QuizOption wrongOption = QuizOption.builder()
                        .optionText(otherOpt)
                        .isCorrect(false)
                        .question(question)
                        .build();
                quizOptionRepository.save(wrongOption);
            }
        }
    }

    private void seedCommunityPosts() {
        if (postRepository.count() == 0) {
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            
            Post post1 = Post.builder()
                    .author("Rohan K.")
                    .role("Eco Active")
                    .avatar("R")
                    .content("Just finished planting 3 native neem saplings in my backyard! Felt great doing my small part for the neighborhood canopy. 🌿 #TreePlanting #GreenCampus")
                    .createdAt(now.minusHours(2))
                    .build();
            post1 = postRepository.save(post1);
            
            Comment comment1 = Comment.builder()
                    .author("Kavya P.")
                    .text("Awesome work Rohan! Neems grow super fast.")
                    .createdAt(now.minusHours(1))
                    .post(post1)
                    .build();
            commentRepository.save(comment1);

            Post post2 = Post.builder()
                    .author("Priya S.")
                    .role("Forest Guardian")
                    .avatar("P")
                    .content("Tip: Switched all the kitchen spotlights to LEDs. Our daily utility usage logged a drop of about 1.5 kWh. Small habits build up!")
                    .createdAt(now.minusHours(5))
                    .build();
            postRepository.save(post2);

            Post post3 = Post.builder()
                    .author("Amit M.")
                    .role("Green Cadet")
                    .avatar("A")
                    .content("Does anyone have composting tips for compact apartments? My balcony gets direct sunlight for only 2 hours. Thanks in advance!")
                    .createdAt(now.minusDays(1))
                    .build();
            post3 = postRepository.save(post3);

            Comment comment3 = Comment.builder()
                    .author("Sonia G.")
                    .text("Try bokashi composting! It is anaerobic, closed, and perfect for indoor apartments.")
                    .createdAt(now.minusHours(18))
                    .post(post3)
                    .build();
            commentRepository.save(comment3);

            System.out.println("Seeded Community Posts & Comments.");
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@ecoverse.com")) {
            User admin = User.builder()
                .fullName("Ecoverse Admin")
                .email("admin@ecoverse.com")
                .password(passwordEncoder.encode("admin123"))
                .institutionName("Ecoverse Org")
                .grade(12)
                .department("Administration")
                .profilePicture("https://api.dicebear.com/7.x/fun-emoji/svg?seed=admin")
                .enabled(true)
                .role("ROLE_ADMIN")
                .xp(0)
                .level(1)
                .currentStreak(0)
                .coins(0)
                .treeXp(0)
                .treeLevel(1)
                .build();
            userRepository.save(admin);
            System.out.println("Seeded Default Admin User.");
        }
        
        if (!userRepository.existsByEmail("staff@ecoverse.com")) {
            User staff = User.builder()
                .fullName("Ecoverse Staff")
                .email("staff@ecoverse.com")
                .password(passwordEncoder.encode("staff123"))
                .institutionName("Ecoverse Org")
                .grade(12)
                .department("Staff")
                .profilePicture("https://api.dicebear.com/7.x/fun-emoji/svg?seed=staff")
                .enabled(true)
                .role("ROLE_STAFF")
                .xp(0)
                .level(1)
                .currentStreak(0)
                .coins(0)
                .treeXp(0)
                .treeLevel(1)
                .build();
            userRepository.save(staff);
            System.out.println("Seeded Default Staff User.");
        }
    }
}
