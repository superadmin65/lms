import passages from './level4/passages';
import lessons from './level4/lessons';

let data = [
  {
    title: `Dolly, my golden fish`,
    text: `Today we will meet Dolly, my golden fish. You will feel happy to see her swim swiftly in her pet jar. My mom presented it for my birthday. I feel so happy to take care of her.  I feed her every day in the morning. When I go near the tank, she will swim fast here and there. I know she is happy to see me. My pet knows me. It may be a surprise to you. But, it is true. Come home to see my pet.`,
    fillup: `meet feet heat
see touch smell
My We Us
care car can
swim walk run
know no now
pet bed get
surprise sunday supply`
  },
  {
    title: `Ski, a sapling`,
    text: `So soft to touch! Have you touched the tender leaves of a baby plant? I have touched it.  Last week in the science exhibition, I saw a baby plant.  Two little leaves in light green colour. The stem looked white and tender. I can see the seed with its seed coat under the leaves.  The baby plant swayed in the soft breeze.  Hello, baby plant!`,
    fillup: `watching sleeping walking
street city town
are is am
afraid angry after
hurt hug hut`
  },
  {
    title: `One, two, three`,
    text: `Little Vino liked to walk up and down on the steps in her school. When she walked, she always counted one, two, three, till she reached the floor. It made her feel happy. Hop, hop, and hop. With a smile, she will hop down the steps. Luckily, no one noticed her.`
  },
  {
    title: `Curve of a moon`,
    text: `A thin curve of the moon looked bright on the night sky. I love watching it from our terrace. My parents are sitting there on the steps and discussing something. I can feel the cool, night breeze.  Though it is dark, I am not afraid. The blinking stars in the night sky watch me safely.`
  },
  {
    title: `Dress like a doll`,
    text: `Dressing like a doll.  I always like to dress my doll. When I am alone at home,  I have my doll to play.  My doll has so many little, little dresses.  Will you believe if I tell I made it?  I used my toy scissors to cut the cloth.  Then, I used bell pins to join them together.  I don’t know how to use a needle.  Every day, I make her wear a new dress. Do you have a doll?`
  },
  {
    title: `Drops of water`,
    text: `Do you feel thirsty?  Yes. Grab your bottle of water.  Take a sip.  Now you feel better.  Look at the birds in the sky.  Where will they go when they feel thirsty? Search for a place with water.  Not so lucky.  Whatever water they get, it is not good.  Who made it polluted?  Think!  Every living thing in this world has the right to live. Leave a bowl of water in your terrace.  Let birds quench their thirst.  You will be blessed!`
  },
  {
    title: `Dews on leaves`,
    text: `Look at the pot of plant near the kitchen window.  The leaves are broad and dark green in colour.  Little, little drops of water!  The water drops reflected a prism of colours.  It is so chilly in the morning!  So there are dew-drops on the leaves.  Can you tell me what colours are there?  I can see shades of red and green. What colours do you see?`
  },
  {
    title: `Sundays are holidays`,
    text: `Every week we have Sunday as our holiday.  Why Sunday is so special for me?  My father takes me along for his morning walk.  We walk briskly to the sea shore. It is just ten minutes from my home.  I can hear the rolling waves of the sea.  It is so good to watch the waves in the morning sun rays.`
  },
  {
    title: `A Crab tale `,
    text: `It is raining heavily today.  I love watching the rain from my home. Suddenly, I can see something crawling in the water on the street.  It is a Crab.  Crabs are wonderful creatures to watch.  I wish I could catch it. But, I am afraid of its pincers.  They may hurt me. `
  },
  {
    title: `Cycle my way`,
    text: `Arun likes to go for a ride in his cycle to the park near his home.  Every day after he comes back from school, he will ride along with his friends to the park.  The park has a separate track for bicycle rides. It is safe to ride in the park. Cycling is a very good exercise.  Not only little boys, even little girls come there for cycling.`
  },
  {
    title: `Sparrows`,
    text: `Hop, hop, hop! Look at the little sparrows! Sparrows are little angels who bring happiness to our homes. Do you like Sparrows? Every day, a pair of sparrows visits our home and chirp happily around. Chatter, chatter, chatter! Sparrows keep on talking continuously. What do they talk? Can you guess?  Sparrows are not only cute. They are smart, little birds. `
  },
  {
    title: `How birds fly?`,
    text: `Look at the flock of birds on the sky. What do you see? Some birds fly from one place to another every year. You can see these birds fly in a V shape. Why? It is to save energy. Birds like Canada Geese and Pelicans fly a long distance. The bird in the front flaps its wings more times. So that other birds need not flap their wings more. They just glide through the air. Is it not amazing?`,
    fillup: `flock group bunch
What Which Why
birds insects fishes 2
V W X
wings legs nose
air land water
amazing? boring? funny?`
  },
  {
    title: `Pigeons`,
    text: `Pigeons are wonderful birds. Pigeons fly fast from one place to another. Today if you want to send a message, you send the message from your mobile. When kings ruled our country, pigeons are used to send messages from one place to another. Kings used pigeons to send important messages. Pigeons are clever birds.  They remember the way they fly. After delivering the message, they return to their place.`
  },
  {
    title: `Stars`,
    text: `Look at the night sky. You can see little, little spots of light.  What are they?  They are Stars.    Can you count the stars in the sky?  One, Two, Three, Four, Five.  Yes. Millions of stars are there on the sky.   Stars are scattered on the sky.  Stars appear and  here.  But, do you know, stars appear in a group.  Every group of stars has a name.  For centuries, stars guide sailors while they are sailing. In a rough sea, stars are better guides to reach the shore safely.`
  },
  {
    title: `Moon`,
    text: `There is a full moon in the sky.  Milky, white light is cool.  It is not hot like sunlight. Some dark spots are there on the moon. What are they?  They are known as craters.  On a  full moon day, you can see the bright moon on the sky.  On a new moon day, there is no moon on the sky.  Moon grows and wanes.  Moon has many tales to tell.`
  },
  {
    title: `Clouds`,
    text: `Morning sky looks bright in the sunlight.  The blue sky is clear.  A small fluffy cloud sails across the sky. What are clouds? Clouds are formed from water in the sky. Sometimes, the bright sun hides behind those clouds.  It will be wonderful if I can sail on the clouds in the sky.  Just like we sail on the water, sailing on the clouds will also be thrilling.  So, high up in the sky on the cloud.  Yes, it is really thrilling...`
  },
  {
    title: `Little Saran`,
    text: `One day, little Saran crawled fast to the bucket of water near the door.  His little hands grabbed the rim of the bucket. After a few slip, he could get up and stand.  Saran peeped into the bucket of water.  With a giggle, he started to play in the water.  Flap, flap, flap, flap, he went on striking on the water.  Playing in the water is his favourite past time.  His little hands splashed the water everywhere around the bucket.  So cool!  How I love to do this!  Little Saran giggled and played till his mother gave him a nice slap.`
  },
  {
    title: `Ant in my hair`,
    text: `Sara always sat near the window in her class.  It was a hot afternoon.  Everyone was feeling sleepy.  The teacher was busy reading from the book.  It was like a lullaby to Sara. Oh!  What a day to spend like this. A little ant from the desk climbed on her and reached her neck.  The little ant didn’t want to disturb Sara.  But wanted to explore what is around her.  In her drowsiness, Sara frowned.  She felt something crawling down her nape.  Her fingers caught it and crushed between her fingers. `
  },
  {
    title: `Run fast`,
    text: `The narrow street looked so busy with so many vehicles down the road. Suddenly,  a white dog came running fast toward something on the roadside.  The moving vehicles stopped for a while.  One, two, three, four.... Within seconds, dogs were chasing each other.  The black dog that followed the white dog did not know what happened.  But, he kept on running. Soon, there were so many dogs on the street barking at each other.  Until, Tara came to chase them away they kept on barking for more than twenty minutes. `
  },
  {
    title: `Feelers in Insects`,
    text: `The most interesting part in an insect is its feelers. Most of the insects have feelers. The feelers are a pair of sense organs found at the front side of the head of an insect. The feelers have receivers to detect the smell in the air. Insects use their feelers to find the level of moisture in air. Some flies use their feelers to measure the speed of the air when they are flying. Butterflies use their feelers to find out the direction to fly. `
  },
  {
    title: `Sparrows`,
    text: `After a very long time, I can now hear the happy chirping of little sparrows.  We look at those little sparrows with wonder. In the school, we are lucky to see the sparrows very near. Now, we can watch sparrows at our homes also. Every day a pair of sparrows comes to our kitchen window to eat the rice my mother leaves for them.  They are now so familiar with us that they hop and sit on the iron bar of the window and look inside the kitchen.`
  },
  {
    title: `Money plant`,
    text: `Money plant is a common indoor plant grown in our homes. Money plant is a climber. It can be grown by planting a twig plucked from the mother plant. Money plant brings wealth and prosperity to our home. Money plant brings in positive energy. It helps to build healthy relationship at home. `
  },
  {
    title: `Mint plant`,
    text: `After using the mint leaves for cooking, my mother planted the empty twigs of mint in a pot. Fresh leaves started to grow from the twigs after some days. Fresh mint leaves will give flavour to the soups or curries. Whenever we need we can pluck fresh mint leaves from the twigs. New leaves will grow within a few days.`
  },
  {
    title: `Basketball`,
    text: `Basketball is a popular sport. People started to play this game hundred years ago. In the year 1891, Dr. James Naismith who was a teacher wanted a new game for his students to play during cold winter. The new game allowed his students to play inside. Players in the game threw a soccer ball into two peach baskets. This made the game to be known as basketball.`
  },
  {
    title: `Cats`,
    text: `Cats are common pets in the world. Cats are very friendly. Cats are independent and they don’t want to stay at home. Cats are human companions for centuries.  Cats are attached to their owners just like dogs are. Having a cat at home can be good for your health.  It is true your cat is more like a family than a pet. `
  },
  {
    title: ` Pure thoughts....`,
    text: `Just as a dash of pure light that strikes through the sky, thoughts on purity occupied my thoughts.   The white colour on our flag reminds me once again about the purity that must rule our thoughts, rule our land, rule the world and finally rule the entire universe.  To recollect – Do we breathe in pure air every day?  - Do we drink pure water every day?  - Do we leave our dear ones pure space to live?   The word 'pure' now has a meaning that has grown enormous and it leaves every nook and corner of a human mind with too many questions.  
    Purity in thoughts; Purity in deeds; Purity in words; Purity in dialogues; Purity in work place; Purity in living space; Purity in footsteps; Purity in pathways.   Purity has become a demanding need of the hour for everywhere we go we are encountered with something impure.  Love for a sophisticated and materialistic life has left us impure.   Though we don't do things wantedly, the end result glares at us – with our own deeds we have triggered the nature's alarm bell.  It is time to wake up with broadened shoulders and thoughts to embrace and welcome purity everywhere.   Let us not leave behind something impure to make us live pure. 
    `
  },
  {
    title: ` An interpretation.....`,
    text: `Look at the familiar doll of three wise monkeys.  What do they tell us?  Don't speak unclean words, don't see unclean situations, don't hear unclean dialogues. Cleanliness is the need of the hour.  Every one of us strive our level best to keep ourselves clean, to wear clean clothes, and to live in a clean space. Yet, knowingly or unknowingly we leave the space around us unclean.  That is something 100% true.  
    In today's context,  the doll of three wise monkeys impart more significance.  The sophisticated life style that we all enjoy prevents us to spare some seconds to think about the future.  For a secure future, we insure our lives.  Do we tend to insure and ensure a clean space for our future generation to live a healthy life?  Sophisticated machines and technology may make our life comfortable and happy.  Yet, think about this – will they assure us and our children a healthy space with pure air to breathe, pure water to drink, and pure food to eat?  Unlike loads of money to spend, let us take an oath to give our children a cleaner world to play, live and be happy. 
    `
  },
  {
    title: `Spinner dolphins`,
    text: `This week, when we went for our usual morning walk at the nearby beach, we were surprised to spot some dolphins. We felt happy to watch the friendly dolphins, which leaped four feet and turned around three times in the air.  One of my friends, a marine biologist, told me that they are spinner dolphins. The mammals looked slender with long thin-beak and a distinct stripe connected the long and pointed flippers to the eyes. 
    Spinner dolphins are commonly found in the tropical and sub-tropical oceans.   He also told me that only spinner dolphins can spin several times in the air. They frequently jump high out of the water and spin around like a spinning top. Some scientists believe that the spinning behaviour is a way of communicating with the other spinners. It may also show the alertness and communicate the school where they are. This acrobatic jump may also help the spinner dolphins to free their food that can be attached to other large fish. 
    According to some resources from the net, I found out that the morning times are the celebration time for the spinner dolphins as they play together. The spinners touch and rub each other and engage in playful games. They swim underneath one another and move their pectoral fins back and forth. Some spinners hold hands with their flippers and caress each other with their tail flukes. 
    Spinner dolphins may differ in body size, shape and color patterns. But, in general they have common characters, namely, slender bodies, long and thin beak, small flippers pointed at the tips, and appeared in dark gray, light gray and white colors. Most of these spinner dolphins have white bellies. Spinner dolphins have 45 to 65 teeth, which are pointed in each side of the upper and lower jaws.  The spinner dolphin feed on small fishes and squids. The female spinners reach sexual maturity at the age of 4 to 7 years and the male spinners reach maturity at the age of 7 to 10 years.  The newborn calves measure 80cm in length.  The female spinner dolphins nurse their calves from one to two years. 
    `
  },
  {
    title: `Flowers`,
    text: `The world will not be a beautiful place if it is without flowers. Flowers with their varied colors and perfume tell the human beings that the life is here to live and enjoy life as it is. Flowers have the power to make even a shabby place look as a place worth living.  A flower can bring along with it cleanliness, beauty and peace of mind to the place.
    According to wikipedia, a flower is a reproductive structure found in flowering plants. The four main parts of a flower are the calyx, corolla, stamen and pistil. The parts of a flower are arranged in a circular pattern called a whorl.  Calyx is the outer whorl of sepals. Calyx is green in color and in some plants it looks like a petal. As a collective unit the sepals form a calyx, and the petals form the Corolla. 
    The Corolla is the inner whorl of petals. The petals are thin, soft and colorful to attract insects for pollination. A whorl of stamens consists of a bunch of filaments. Each filament is topped by an anther, in which pollen is produced. The pollen contains the male gametes. The pistil is the female part of the flower. The pistil has the carpel, which is the female reproductive organ of a flower. The sticky tip of the pistil is called stigma and it receives the pollen grains. 
    The floral structure of every plant is different from the other. The main parts of a flower are described by their position and not by their function. It is surprising to note that all the flowers do not have all the four main parts of a flower. Some flowers lack some parts or sometimes they are modified for some specific function. The floral formula is used by the botanists to represent the structure of a flower. Specific letters, symbols and numerals are used to describe the structure of a flower. 
    Ca – calyx
    Co – corolla
    A – androecium
    G – gynoecium
    
    
    Many flowers are used as symbols with specific meanings. Red roses are considered as symbols for love, beauty and passion. Daisies are considered as symbols for innocence. Lilies are considered as symbols for resurrection and life. 
    Jasmine is also considered as a symbol for love. Orchids are symbols for perfection, and sunflowers are considered as a symbol for infatuation. In Hindu mythology, Lotus is considered as a symbol for fertility, purity and creation. 
    `
  },
  {
    title: `Pranny and the wild horse`,
    text: `Pranny ran to the school bus with a hop. Her friends greeted her with a loud cheer.  One by one they got into the bus. Luckily Pranny got the window seat.  Pranny always liked to sit near the window. She loved to count the number of trees that crossed their bus. Pranny started to count the number of trees when their bus entered into the main road.  Pranny had finished counting one hundred when they reached their picnic spot. Pranny and her friends jumped down from the bus and entered the park with a scream that can bring down the buildings. Luckily, there were no buildings and the wide sky echoed back their scream. Pranny's teacher asked them to form a line and walk in pairs. Holding the hand of the partner, everyone started to climb up the path on the hill. 
    Once they reached the plain surface at the top of the hill, everyone started to collect different types of flowers and leaves as their specimens. After some time, Pranny found out that she had walked away from her friends. Not a bit worried, she started to collect her flowers. Suddenly she heard the galloping sound of a horse. A wild pony came galloping toward her.  Pranny wanted to move away from the horse. So, she started to run. But, instead of running away from the horse, Pranny started to run toward the horse.  The shocked pony stopped and looked at her.  Then, with a wild cry, the pony turned away from Pranny and climbed down the hill galloping in speed. It took a while for Pranny to come to her senses. Then with a cool shake of her shoulders, she started to collect her flowers once again.`
  },
  {
    title: `Tiny, the cute lizard`,
    text: `The mother lizard slowly climbed the open shelf at the corner of the kitchen searching for a place to lay her eggs. For the past two days it hunted for a safer place where she could keep her eggs. The top corner of the shelf proved to be a safer place. Some bottles filled in the space and hid the corner of the shelf from the view. It will take at least six weeks for the eggs to hatch.  Once baby lizards come out of the eggs, they can move freely in no time.
    Six weeks later, more than six baby lizards hatched out of the eggs.  All the baby lizards followed their mother outside.  The mother lizard led them to the nearby tree and started to teach them how to hunt small insects as their food.  The last one which hatched from the egg did not want to move away from the hiding place in the shelf. The mother went searching for Tiny.  The little lizard curled up at the corner of the shelf refused to follow her.
    ‘I am not coming.’ Tiny replied to her mother. 
    ‘What are you going to do here? You will not get enough food here.’ 
    ‘It is so warm and cozy here. I don’t want to come out and freeze in the cold.’ Tiny replied sharply.
    ‘Freezing cold? Who told you so? Come out and see yourself.’ The mother lizard called Tiny once again. 
    ‘Is it not winter now?’ 
    ‘Yes, but it is not so cold.  If it is cold we can stay inside the garage. People will chase you away if they find you.’ But, Tiny was not in a position to listen to her mother. 
    At that moment, Bob, the cat entered the kitchen. His sharp nostrils told the presence of the lizard. Without making a noise, he jumped on to the flat slab near the sink. Standing near the sink, he looked around searching for a way to reach the top of the shelf. In the mean while, the mother lizard has moved half way on the wall. Sensing danger, she wanted to move fast and escape out of the window. Looking at the cat, she moved her tail fast and let a part of the tail break away.  The tiny piece of tail fell on the floor of the kitchen and it started to wriggle as if struggling for life. Bob jumped down and sat down looking at the wriggling tail. Tiny was silently watching all these things. Without making any more comments, she silently followed her mother and went out through the kitchen window.`
  },
  {
    title: `Millie, an alien `,
    text: `The cool rays of moon peeped in through the gap between the thin strips of coconut leaves. Standing in the terrace, Mini stood watching the moving clouds in the sky.  Gracefully the clouds sailed through the sky.  Gazing continuously at the full moon made her feel calm at heart and it also helped her nerves to settle down with a rhythm. Suddenly a ray of light started to descend from the sky. The thin ray of light slowly got dispersed and touched the top of a coconut tree.  The coconut leaves slowly moved in the evening breeze and sent the light in every direction. The pale colored light rays slowly deepened to illuminating green light.  The green light which struck the coconut tree started to move toward Mini.
    The dazzling brightness of the light made her eyes blink for a while. The bright light touched her feet. Something moved in the green light and reached her. As if walking through a long corridor, a small doll like figure walked out of the green light. In the darkness, she could not make it out how it looked like. 
    Mini stooped down to see clearly how the little figure looked like. The first thing that Mini noticed is the strong smell that came from it. The aroma roused and spread all around her. Mini felt to be standing inside a circle of hypnotic power. Her skin started to breathe out tiny drops of sweat and her palms became wet with sweat. She wanted to open her mouth and speak to the little alien like creature. Her tongue struggled hard to move but she could not open her mouth. 
    Millie, the alien, looked at Mini.  The eyes without any eye brows looked at her. It sent a vibration throughout her body. Mini felt hot and cold at the same time, and a strange feeling went down her spine. While Mini struggled with such a sensation, chilled spray of water splashed at her face and dribbled down her chin.  Mini suddenly came into senses. The overflowing water from the water tank has helped her to come out of the trance and break the magic spell from the alien. Within seconds the green light started to ascend toward the sky and disappeared from sight. Mini slowly tried to recollect what happened to her. But, she could not do so. Her memory cells wiped clean of whatever that has happened a few minutes ago made her look blank at the wide blue sky. 
    `
  },
  {
    title: `Neemoo, the little ant`,
    text: `‘Joe, come and have your breakfast.’ Mary called her nine year old son.
    As usual, he is late for school. Running down the stairs, he reached the table. Throwing bread crumbs all around, he finished his morning breakfast.
    ‘Sit down and drink your juice’ His mother screamed at her. Every morning is a struggle with him. Till he gets into the school bus, the whole place will look like a fighting pit.
    Sitting down on the chair, Joe started to sip the fresh juice. Down near the left corner of the table, a little ant scrambled on its way. Attracted by the bread crumbs that Joe spilled around, it moved near to pick up a large piece. Some bits of crumbs stood on the polished shoes of Joe. Surprisingly, the little ant wanted to carry that crumb home. The little ant slowly climbed on the left shoe. When the ant reached the top of the left shoe, Joe finished drinking the juice.
    ‘Ma, bye, bye.’ Joe started to walk toward the door. The little ant shocked at the sudden jerk, held tightly to the threads of the socks. The bread crumbs fell down on the floor, but Neemoo, the little ant could not climb down the shoe. Breathless, it stayed at the top of the shoe.
    When Joe climbed into the bus, Neemoo lost the grip and fell on the last step of the bus. The door of the bus closed and started move toward the school where Joe studied. Neemoo stretched his feelers to know where he is. Neemoo heard the shrilling scream of little boys and girls. Neemoo moved here and there on the last step of the bus. After walking around few circles, Neemoo decided to rest at the corner of the step. Neemoo lived in the corner of the dining room at Joe’s house. He has never gone out of the dining room. Even if he goes out to the window sill, some ants always came along. This is the first time Neemoo is away from the home and traveling in the bus.
    After the children went to the school, someone started to clean the bus. Neemoo did not know what to do. He moved into the interior corner of the step and stayed there without moving a leg.
    `
  }
];

export default [...passages, ...lessons, ...data];
