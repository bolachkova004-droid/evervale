
const initial={level:null,protagonist:null,found:[],analysisStep:0,analysisScore:0,hiddenFound:[],caretakerStep:0,caretakerTrust:0,longCaseStep:0,longCaseScore:0,longCaseFacts:0,longCaseMistakes:0,longCaseWitnesses:0,longCaseDocuments:0,longCaseDone:false,memoryStage:0,memoryTraceStep:0,deepMemoryDone:false,stability:100,influence:0,trust:0,question:0,words:[],music:false,morwenSeen:false,orenSeen:false,silasSeen:false,queenSeen:false,kaelSeen:false,campaignNode:null,campaignHistory:[],route:null,alignment:{ministry:0,freedom:0,archive:0,mirror:0},bonds:{silas:0,irene:0,morwen:0,oren:0,kael:0},secrets:[]};var state=normaliseState(load()||{...initial});let codexBack='intro';let appearanceNext='investigation';let appearanceKey='irene';
const UI={
 A1:{brand:'АРХИВ МЁРТВЫХ ИМЁН',evidence:'Улики',stability:'Стабильность',influence:'Влияние',music:'♫ Музыка',introK:'Дело № 01',introT:'Женщина без лица',intro1:'At night, the City Archive received an anonymous message. A woman was found dead in Apartment 17.',intro2:'Ночью городской Архив получил анонимное сообщение. В квартире №17 найдена погибшая женщина. На её ладони выжжено ваше имя.',introB:'Войти в квартиру',investK:'Осмотр места преступления',investT:'Apartment No. 17',progress:'Этап 1 из 5 · найдите четыре следа',time:'Upper District · 02:17',scene:'The apartment looks inhabited, but there are no personal photographs. The clock stopped one minute before midnight.',sceneRu:'Квартира выглядит обжитой, но здесь нет ни одной личной фотографии. Часы остановились за минуту до полуночи.',materials:'Материалы дела',lead:'Читайте английские описания улик. Перевод и ключевые слова показаны ниже.',memory:'Проанализировать улики',memoryBrand:'ПОГРУЖЕНИЕ В ПАМЯТЬ',memoryK:'Составьте последнюю фразу погибшей',sentence:'Нажимайте на слова в правильном порядке',reset:'Сбросить',memoryHint:'Показать перевод',trust:'Доверие',witness:'Свидетель',role:'Бывший королевский дознаватель',q:'Вопрос',of:'из',verdictBrand:'ОФИЦИАЛЬНАЯ ВЕРСИЯ',verdictK:'Решение по делу',verdictT:'Какую правду вы выберете?',verdictC:'The victim was connected to the forbidden project called “Second History”. The Ministry wants the case closed. Ваш отчёт изменит судьбу города.',endK:'Конец первого эпизода',restart:'Сыграть заново',menu:'Главное меню',ireneRole:'КУРАТОР · ПОДСКАЗКА НА РУССКОМ'},
 A2:{brand:'THE ARCHIVE OF DEAD NAMES',evidence:'Clues',stability:'Stability',influence:'Influence',music:'♫ Music',introK:'CASE 01',introT:'The Faceless Woman',intro1:'At night, the City Archive received an anonymous message. A woman was found dead in Apartment 17.',intro2:'The official registry says she never existed. Your name was burned into her palm.',introB:'Enter the apartment',investK:'Crime-scene inspection',investT:'Apartment No. 17',progress:'Stage 1 of 5 · find four traces',time:'Upper District · 02:17',scene:'The apartment looks inhabited, but there are no personal photographs. Clothes of several sizes hang in the wardrobe. The clock stopped one minute before midnight.',sceneRu:'Квартира выглядит обжитой, но здесь нет личных фотографий. В шкафу висит одежда разных размеров. Часы остановились за минуту до полуночи.',materials:'Case materials',lead:'Read the clues in English. Translation and vocabulary are available when needed.',memory:'Analyse the evidence',memoryBrand:'MEMORY DIVE',memoryK:'Reconstruct the victim’s final sentence',sentence:'Choose the words in the correct order',reset:'Reset',memoryHint:'Show translation',trust:'Trust',witness:'Witness',role:'Former Royal Investigator',q:'Question',of:'of',verdictBrand:'OFFICIAL VERSION',verdictK:'Case decision',verdictT:'Which truth will you choose?',verdictC:'The victim was connected to the forbidden project called “Second History”. The Ministry has already demanded that the investigation be closed. Your report will change the fate of the city.',endK:'End of Episode One',restart:'Play again',menu:'Main menu',ireneRole:'CURATOR · OPTIONAL SUPPORT'},
 B1:{brand:'THE ARCHIVE OF DEAD NAMES',evidence:'Clues',stability:'Stability',influence:'Influence',music:'♫ Music',introK:'CASE 01',introT:'The Faceless Woman',intro1:'Shortly after midnight, the City Archive received an anonymous message. A woman had been found dead in Apartment 17.',intro2:'No official record confirms that she ever existed. Yet your name was burned into the skin of her palm.',introB:'Enter the apartment',investK:'Crime-scene inspection',investT:'Apartment No. 17',progress:'Stage 1 of 5 · find four traces',time:'Upper District · 02:17',scene:'The apartment appears inhabited, yet every personal trace has been removed. The wardrobe contains clothes in several sizes, while the clock has stopped one minute before midnight.',sceneRu:'',materials:'Case materials',lead:'Every object may be evidence, a manufactured memory, or a message intended specifically for you.',memory:'Analyse the evidence',memoryBrand:'MEMORY DIVE',memoryK:'Reconstruct the victim’s final sentence',sentence:'Select the words in the correct order',reset:'Reset',memoryHint:'',trust:'Trust',witness:'Witness',role:'Former Royal Investigator',q:'Question',of:'of',verdictBrand:'OFFICIAL VERSION',verdictK:'Case decision',verdictT:'Which truth will you choose?',verdictC:'The victim was connected to the forbidden project known as “Second History”. The Ministry has already demanded that the investigation be closed. Your report will alter not only this case, but the future structure of the city.',endK:'End of Episode One',restart:'Play again',menu:'Main menu',ireneRole:'LANGUAGE & INTERROGATION CURATOR'}
};
const clues=[
 {en:'Silver memory-thread',desc:'Used during illegal memory correction.',ru:'Серебряная нить памяти · используется при незаконной коррекции воспоминаний.',words:'thread — нить · illegal — незаконный'},
 {en:'A mirror without a reflection',desc:'The frame is engraved: “You knew me before.”',ru:'Зеркало без отражения · на раме выгравировано: «Ты знала меня раньше».',words:'reflection — отражение · before — раньше'},
 {en:'A letter with no recipient',desc:'The ink responds to the investigator’s voice.',ru:'Письмо без адресата · чернила реагируют на голос следователя.',words:'recipient — получатель · respond — реагировать'},
 {en:'An empty Ministry ampoule',desc:'Manufactured three days before your official date of birth.',ru:'Пустая ампула Министерства · изготовлена за три дня до вашей официальной даты рождения.',words:'ampoule — ампула · manufactured — изготовленный'}
];

const analysisQuestions=[
 {q:'Which object proves direct Ministry involvement?',qRu:'Какой предмет доказывает прямое участие Министерства?',context:'Only one clue was manufactured inside an official memory facility.',contextRu:'Только одна улика была изготовлена в официальном учреждении памяти.',options:[['The silver thread','Серебряная нить',false],['The empty ampoule','Пустая ампула',true],['The mirror','Зеркало',false]],feedback:'The ampoule carries a Ministry production mark and a date older than your official identity.'},
 {q:'What does the sentence “You knew me before” imply?',qRu:'Что подразумевает фраза «You knew me before»?',context:'The message is personal, but its grammar also establishes a timeline.',contextRu:'Послание личное, но его грамматика также задаёт временную линию.',options:[['The victim met you earlier that evening','Погибшая встретила вас раньше в тот вечер',false],['The victim knew a previous version of your identity','Погибшая знала предыдущую версию вашей личности',true],['The victim expected you to arrive first','Погибшая ожидала, что вы придёте первой',false]],feedback:'“Before” points beyond the current case and suggests an erased earlier identity.'},
 {q:'Which event must have happened first?',qRu:'Какое событие должно было произойти первым?',context:'Compare the ampoule date with the official date of your birth.',contextRu:'Сравните дату на ампуле с официальной датой вашего рождения.',options:[['Your official identity was registered','Вашу официальную личность зарегистрировали',false],['The ampoule was manufactured','Ампулу изготовили',true],['The victim entered Apartment 17','Погибшая вошла в квартиру №17',false]],feedback:'The ampoule predates your registered birth, proving that the operation began before the person you officially are.'},
 {q:'Why is the passive sentence “The city was rewritten” important?',qRu:'Почему важна пассивная фраза «The city was rewritten»?',context:'Passive voice focuses on the result and can conceal the agent.',contextRu:'Пассивный залог подчёркивает результат и может скрывать исполнителя.',options:[['It proves the city wrote its own history','Она доказывает, что город написал собственную историю',false],['It hides who performed the rewriting','Она скрывает, кто выполнил переписывание',true],['It means the rewriting is still happening now','Она означает, что переписывание продолжается сейчас',false]],feedback:'The missing agent is not a grammar accident. Someone deliberately removed responsibility from the sentence.'}
];
const hiddenClues=[
 {en:'A music box with a recorded voice',desc:'The melody stops whenever your name is spoken.',ru:'Музыкальная шкатулка с записью голоса. Мелодия останавливается, когда произносят ваше имя.',words:'recorded voice — записанный голос · melody — мелодия'},
 {en:'A district map marked with seventeen circles',desc:'Apartment 17 appears in seventeen different buildings.',ru:'Карта района с семнадцатью кругами. Квартира №17 отмечена в семнадцати разных зданиях.',words:'district map — карта района · marked — отмеченный'},
 {en:'A torn photograph of the investigator',desc:'The missing half once contained another person.',ru:'Разорванная фотография следователя. На отсутствующей половине был ещё один человек.',words:'torn photograph — разорванная фотография · missing half — отсутствующая половина'},
 {en:'A second memory seal',desc:'It contains a voiceprint belonging to Mara Holt.',ru:'Вторая печать памяти. В ней хранится голосовой след Мары Холт.',words:'voiceprint — голосовой след · belonging to — принадлежащий'}
];
const caretakerDialogue=[
 {speech:'The woman rented this room eleven years ago. She looked exactly the same then.',ru:'Женщина сняла эту комнату одиннадцать лет назад. Тогда она выглядела точно так же.',context:'Mara avoids looking at the photograph in your hand.',contextRu:'Мара избегает смотреть на фотографию в вашей руке.',vocab:['rent a room — снять комнату','exactly the same — точно так же','avoid looking — избегать взгляда'],choices:[
  {tone:'TIMELINE',en:'Who paid the rent during those eleven years?',ru:'Кто платил аренду все эти одиннадцать лет?',trust:1,influence:1,fb:'A factual question forces the witness to identify a continuing source of support.'},
  {tone:'PRESSURE',en:'You are protecting someone who used this building.',ru:'Вы защищаете того, кто использовал это здание.',trust:-1,influence:2,fb:'The accusation may produce information quickly, but it reduces trust.'},
  {tone:'EMPATHY',en:'You were afraid of her. Tell me why.',ru:'Вы боялись её. Расскажите почему.',trust:2,influence:0,fb:'Naming the emotion allows the witness to explain rather than defend herself.'}]},
 {speech:'Every seventeenth night, a different woman entered the apartment. Every one of them used the same key.',ru:'Каждую семнадцатую ночь в квартиру входила другая женщина. У каждой был один и тот же ключ.',context:'The pattern on the map suddenly makes sense: Apartment 17 was not one location, but a rotating network.',contextRu:'Узор на карте становится понятным: квартира №17 была не одним местом, а меняющейся сетью.',vocab:['every seventeenth night — каждую семнадцатую ночь','the same key — тот же ключ','rotating network — меняющаяся сеть'],choices:[
  {tone:'CLARIFY',en:'Did any of them ever leave after sunrise?',ru:'Кто-нибудь из них выходил после рассвета?',trust:1,influence:1,fb:'The question tests whether the visitors were people, reconstructed identities, or transported memories.'},
  {tone:'DEDUCTION',en:'They were versions of the same person, were they not?',ru:'Это были версии одного человека, не так ли?',trust:2,influence:1,fb:'A tag question invites confirmation while showing that you have recognised the pattern.'},
  {tone:'CONTROL',en:'Give me every date and every name you recorded.',ru:'Передайте мне все записанные даты и имена.',trust:0,influence:2,fb:'The imperative establishes authority but may prevent a more personal confession.'}]},
 {speech:'I never recorded their names. The Archive removed the names from my ledger before I could write them.',ru:'Я никогда не записывала их имена. Архив удалял имена из журнала раньше, чем я успевала их написать.',context:'Mara shows you a ledger filled with blank spaces in otherwise complete sentences.',contextRu:'Мара показывает журнал с пустыми местами внутри полностью записанных предложений.',vocab:['ledger — журнал учёта','blank space — пустое место','before I could — прежде чем я успела'],choices:[
  {tone:'LANGUAGE',en:'Read one of the incomplete sentences aloud.',ru:'Прочитайте одно из незаконченных предложений вслух.',trust:2,influence:0,fb:'Speaking the sentence may restore the missing name through sound rather than ink.'},
  {tone:'SCEPTICISM',en:'Paper does not forget by itself.',ru:'Бумага не забывает сама по себе.',trust:0,influence:2,fb:'A concise sceptical statement challenges the witness without directly calling her a liar.'},
  {tone:'OFFER',en:'Help me recover the names, and I will keep you out of the official report.',ru:'Помогите восстановить имена, и я не включу вас в официальный отчёт.',trust:1,influence:2,fb:'A conditional bargain increases leverage and creates a moral debt.'}]},
 {speech:'The final sentence was addressed to you: “If you remember me, do not trust the first version.”',ru:'Последнее предложение было адресовано вам: «Если вы меня вспомните, не доверяйте первой версии».',context:'The warning could refer to a person, a report, or even the first memory you recover.',contextRu:'Предупреждение может относиться к человеку, отчёту или даже первому восстановленному воспоминанию.',vocab:['be addressed to — быть адресованным','first version — первая версия','warning — предупреждение'],choices:[
  {tone:'VERIFY',en:'Whose voice spoke the sentence?',ru:'Чей голос произнёс это предложение?',trust:2,influence:1,fb:'Verification separates the content of a message from the identity of its speaker.'},
  {tone:'INTERPRET',en:'The “first version” may be the official story of her death.',ru:'«Первая версия» может быть официальной историей её смерти.',trust:1,influence:1,fb:'You state a plausible interpretation without treating it as proven fact.'},
  {tone:'PERSONAL',en:'Did the voice sound like mine?',ru:'Голос был похож на мой?',trust:3,influence:0,fb:'A personal question opens the most dangerous possibility: the victim may be another version of you.'}]}
];
const memoryTraceQuestions=[
 {title:'The Voice Behind the Music',titleRu:'Голос за мелодией',context:'The music box repeats three versions of the same sentence. Only one matches Mara’s ledger.',contextRu:'Музыкальная шкатулка повторяет три версии одной фразы. Только одна совпадает с журналом Мары.',fragment:'If you remember me, do not trust the first version.',fragmentRu:'Если вы меня вспомните, не доверяйте первой версии.',options:[['If you remember me, trust the first version.','Если вы меня вспомните, доверьтесь первой версии.',false],['If you remember me, do not trust the first version.','Если вы меня вспомните, не доверяйте первой версии.',true],['If you remembered me, you would trust the first version.','Если бы вы меня помнили, вы бы доверяли первой версии.',false]],feedback:'The negative imperative is essential: the speaker is warning you against the earliest explanation.'},
 {title:'The Condition in the Seal',titleRu:'Условие в печати',context:'A second instruction uses “unless”. Choose the equivalent meaning.',contextRu:'Во второй инструкции используется “unless”. Выберите равнозначный смысл.',fragment:'Do not open the seal unless Silas is present.',fragmentRu:'Не открывайте печать, если Сайлас не присутствует.',options:[['Open the seal only if Silas is present.','Откройте печать только в присутствии Сайласа.',true],['Open the seal before Silas arrives.','Откройте печать до прихода Сайласа.',false],['Never open the seal when Silas is present.','Никогда не открывайте печать при Сайласе.',false]],feedback:'“Unless” means “except if”. The seal should be opened only when Silas is there.'},
 {title:'The Contradictory Memory',titleRu:'Противоречивое воспоминание',context:'The recovered scene shows the victim leaving the room after the recorded time of death. Which conclusion is safest?',contextRu:'Восстановленная сцена показывает, как погибшая выходит из комнаты после зафиксированного времени смерти. Какой вывод наиболее осторожный?',fragment:'She left Apartment 17 at 00:06. The official report places her death at 23:59.',fragmentRu:'Она вышла из квартиры №17 в 00:06. Официальный отчёт указывает время смерти 23:59.',options:[['The witness must be lying.','Свидетель обязательно лжёт.',false],['The official timeline or the victim’s identity has been manipulated.','Официальная временная линия или личность погибшей были изменены.',true],['The clock was exactly correct, so no contradiction exists.','Часы были абсолютно точны, поэтому противоречия нет.',false]],feedback:'The evidence proves a contradiction, not yet its cause. A careful investigator keeps both manipulation theories open.'}
];

const dialogue=[
 {speech:'She came to me three nights ago. She said the Archive had erased her twice, and that you were the only person who could prove it.',ru:'Она пришла ко мне три ночи назад. Она сказала, что Архив стирал её дважды и только вы можете это доказать.',context:'Silas watches your face carefully. He seems to be measuring what you remember.',contextRu:'Сайлас внимательно следит за вашей реакцией. Кажется, он пытается понять, что именно вы помните.',vocab:['erase — стирать','prove — доказывать','just before — незадолго до'],choices:[
 {tone:'Clarify',en:'What exactly did she want me to prove?',ru:'Что именно она хотела, чтобы я доказала?',trust:1,influence:1,fbEn:'A precise open question. “What exactly…” asks for detail without revealing your own position.',fbRu:'Точный открытый вопрос. “What exactly…” помогает получить детали, не раскрывая собственную позицию.'},
 {tone:'Pressure',en:'You are leaving something out.',ru:'Вы что-то недоговариваете.',trust:-1,influence:2,fbEn:'Direct pressure. “Leave something out” means to omit important information.',fbRu:'Прямое давление. “Leave something out” означает умолчать о важной информации.'},
 {tone:'Control',en:'Start from the beginning, Silas. Slowly.',ru:'Начните с самого начала, Сайлас. Медленно.',trust:0,influence:2,fbEn:'A controlled imperative. Short sentences establish authority.',fbRu:'Сдержанный императив. Короткие фразы помогают установить контроль.'}]},
 {speech:'She carried an unregistered memory seal. It contained a scene that had been removed from every official archive.',ru:'У неё была незарегистрированная печать памяти. В ней хранилась сцена, удалённая из всех официальных архивов.',context:'He places a small metal seal on the table but keeps one gloved hand over it.',contextRu:'Он кладёт на стол маленькую металлическую печать, но продолжает прикрывать её рукой в перчатке.',vocab:['unregistered — незарегистрированный','contain — содержать','remove — удалять'],choices:[
 {tone:'Procedure',en:'Was the seal ever registered under another name?',ru:'Была ли печать зарегистрирована под другим именем?',trust:1,influence:1,fbEn:'A procedural question that tests whether the evidence may have a hidden legal identity.',fbRu:'Процедурный вопрос: вы проверяете, могла ли улика иметь скрытую официальную регистрацию.'},
 {tone:'Accusation',en:'Why did you fail to report it?',ru:'Почему вы не сообщили об этом?',trust:-1,influence:2,fbEn:'“Fail to report” sounds formal and implies professional misconduct.',fbRu:'“Fail to report” звучит официально и подразумевает нарушение служебных обязанностей.'},
 {tone:'Inference',en:'You protected her because you knew who she was.',ru:'Вы защищали её, потому что знали, кто она.',trust:2,influence:0,fbEn:'An inference presented as a statement may provoke either a confession or a denial.',fbRu:'Вывод, поданный как утверждение, может вызвать признание или резкое отрицание.'}]},
 {speech:'The woman called you Elara. She claimed it was your name before the Archive reconstructed your identity.',ru:'Женщина называла вас Эларой. Она утверждала, что это было ваше имя до того, как Архив восстановил вашу личность.',context:'The name produces a physical reaction: a flash of a staircase, blood-red glass, and Silas holding your hand.',contextRu:'Имя вызывает физическую реакцию: вспышка воспоминания о лестнице, кроваво-красном стекле и руке Сайласа.',vocab:['claim — утверждать','reconstruct — восстанавливать','identity — личность'],choices:[
 {tone:'Clarify',en:'Are you saying my memories were deliberately altered?',ru:'Вы говорите, что мои воспоминания изменили намеренно?',trust:1,influence:1,fbEn:'“Are you saying…” checks the implication before accepting it as fact.',fbRu:'“Are you saying…” позволяет уточнить смысл, прежде чем принять его как факт.'},
 {tone:'Scepticism',en:'Names can be forged. Memory can be manufactured.',ru:'Имена можно подделать. Память можно создать искусственно.',trust:0,influence:2,fbEn:'Parallel passive structures make the reply sound controlled and analytical.',fbRu:'Параллельные пассивные конструкции делают реплику сдержанной и аналитичной.'},
 {tone:'Personal',en:'Tell me what happened to us.',ru:'Расскажите, что произошло с нами.',trust:3,influence:-1,fbEn:'“What happened to us” changes the interrogation into a personal conversation.',fbRu:'“What happened to us” переводит допрос в личный разговор.'}]},
 {speech:'You and your sister worked on Second History. The project was designed to rebuild Evervale after the city had already died.',ru:'Вы и ваша сестра работали над «Второй историей». Проект создали, чтобы восстановить Эвервейл после того, как город уже погиб.',context:'For the first time, Silas looks afraid—not of you, but of the walls around you.',contextRu:'Впервые Сайлас выглядит испуганным — не вами, а стенами вокруг.',vocab:['be designed to — быть созданным для','rebuild — восстановить','already — уже'],choices:[
 {tone:'Investigation',en:'What was the project designed to change?',ru:'Что именно должен был изменить проект?',trust:1,influence:1,fbEn:'This question focuses on purpose. “Was designed to” is useful for describing intended function.',fbRu:'Вопрос направлен на цель. “Was designed to” используется для описания задуманной функции.'},
 {tone:'Authority',en:'Who authorised the reconstruction?',ru:'Кто санкционировал восстановление?',trust:0,influence:2,fbEn:'“Authorise” is formal vocabulary used for official permission and institutional power.',fbRu:'“Authorise” — формальное слово для официального разрешения и институциональной власти.'},
 {tone:'Confrontation',en:'And what part did you play in it?',ru:'И какую роль во всём этом играли вы?',trust:1,influence:2,fbEn:'The phrase “play a part in” means to be involved in an event or process.',fbRu:'“Play a part in” означает участвовать в событии или процессе.'}]},
 {speech:'I can give you the key to the sealed archive. But once you open it, the Ministry will know that you have remembered.',ru:'Я могу дать вам ключ от закрытого архива. Но как только вы его откроете, Министерство узнает, что вы всё вспомнили.',context:'Silas opens his hand. A black key rests on his palm, threaded with violet light.',contextRu:'Сайлас раскрывает ладонь. На ней лежит чёрный ключ, пронизанный фиолетовым светом.',vocab:['sealed — запечатанный','once — как только','be aware — знать, осознавать'],choices:[
 {tone:'Direct',en:'Give me the key.',ru:'Дайте мне ключ.',trust:0,influence:3,fbEn:'A direct imperative: clear, forceful, and emotionally closed.',fbRu:'Прямой императив: чёткий, сильный и эмоционально закрытый.'},
 {tone:'Cautious',en:'I need evidence before I risk exposing myself.',ru:'Мне нужны доказательства, прежде чем я рискну себя раскрыть.',trust:1,influence:1,fbEn:'“Before I risk…” expresses a condition based on danger and consequence.',fbRu:'“Before I risk…” выражает условие, связанное с опасностью и последствиями.'},
 {tone:'Alliance',en:'Then come with me. We open it together.',ru:'Тогда идите со мной. Мы откроем его вместе.',trust:3,influence:0,fbEn:'A proposal of alliance. The shift to “we” creates shared responsibility.',fbRu:'Предложение союза. Переход к “we” создаёт общую ответственность.'}]}
,
 {speech:'Mara’s ledger contains your handwriting, although the entry was made eleven years before your official birth.',ru:'В журнале Мары есть ваш почерк, хотя запись сделана за одиннадцать лет до вашего официального рождения.',context:'Silas recognises the handwriting immediately. He does not look surprised enough.',contextRu:'Сайлас сразу узнаёт почерк. Он выглядит недостаточно удивлённым.',vocab:['handwriting — почерк','entry — запись','official birth — официальное рождение'],choices:[
 {tone:'CONFRONT',en:'You have seen this handwriting before. Where?',ru:'Вы уже видели этот почерк. Где?',trust:1,influence:2,fbEn:'A direct question identifies the contradiction in Silas’s reaction.',fbRu:'Прямой вопрос указывает на противоречие в реакции Сайласа.'},
 {tone:'INFERENCE',en:'The ledger belonged to a previous version of me.',ru:'Журнал принадлежал предыдущей версии меня.',trust:2,influence:1,fbEn:'The statement invites Silas to correct or confirm a dangerous inference.',fbRu:'Утверждение заставляет Сайласа подтвердить или исправить опасный вывод.'},
 {tone:'SILENCE',en:'Say nothing and let him explain the handwriting first.',ru:'Промолчать и позволить ему первым объяснить почерк.',trust:3,influence:0,fbEn:'Strategic silence can create pressure without an accusation.',fbRu:'Стратегическое молчание создаёт давление без прямого обвинения.'}]},
 {speech:'The first version is not me, and it is not Morwen. It is the memory you have just recovered. Someone placed a false beginning inside the victim.',ru:'Первая версия — не я и не Морвен. Это воспоминание, которое вы только что восстановили. Кто-то поместил ложное начало внутрь погибшей.',context:'This changes the case: even evidence extracted from memory may have been designed to mislead you.',contextRu:'Это меняет дело: даже извлечённое воспоминание могло быть создано специально, чтобы ввести вас в заблуждение.',vocab:['false beginning — ложное начало','be designed to mislead — быть созданным для обмана','recover a memory — восстановить воспоминание'],choices:[
 {tone:'METHOD',en:'Then we verify every memory against physical evidence.',ru:'Тогда мы проверим каждое воспоминание по вещественным доказательствам.',trust:2,influence:1,fbEn:'A disciplined response protects the investigation from manufactured memories.',fbRu:'Дисциплинированный ответ защищает расследование от искусственных воспоминаний.'},
 {tone:'THREAT',en:'If you planted it, this is your last chance to confess.',ru:'Если это сделали вы, сейчас ваш последний шанс признаться.',trust:-2,influence:3,fbEn:'The threat increases leverage but may destroy cooperation.',fbRu:'Угроза усиливает давление, но может разрушить сотрудничество.'},
 {tone:'PERSONAL',en:'Why would someone build a memory specifically for me?',ru:'Зачем кому-то создавать воспоминание специально для меня?',trust:3,influence:0,fbEn:'The personal question redirects the investigation toward motive and identity.',fbRu:'Личный вопрос переводит расследование к мотиву и личности.'}]}
];
const verdicts={
 A1:[['Порядок','Передать дело Министерству','Hide the existence of Second History. Скрыть проект и сохранить спокойствие города.','order'],['Истина','Опубликовать доказательства','Tell the city that its past was rewritten. Рассказать городу правду.','truth'],['Личный выбор','Уничтожить отчёт','Keep the evidence and investigate your own identity in secret.','personal']],
 A2:[['Order','Give the case to the Ministry','Hide the existence of Second History and preserve public stability.','order'],['Truth','Publish the evidence','Tell the city that its entire past was rewritten.','truth'],['Personal choice','Destroy the report','Keep the evidence and investigate your own identity in secret.','personal']],
 B1:[['Order','Hand the case to the Ministry','Suppress all evidence of Second History and preserve the political stability of Evervale.','order'],['Truth','Release the evidence','Reveal that the city’s history was reconstructed and allow the consequences to unfold.','truth'],['Personal choice','Erase the official case','Keep the evidence, disappear from the Archive, and investigate your former identity with Silas.','personal']]
};

const appearanceData={
 irene:{name:'Irene Vale',role:'Language Curator',badge:'Case briefing',quote:'“Before you question the dead, learn to question the words they left behind.”',context:'Irene opens the sealed case file and marks three expressions in violet ink. She warns you that someone has rewritten not only the victim’s records, but the language used to describe the crime.',ru:'«Прежде чем задавать вопросы мёртвым, научитесь сомневаться в словах, которые они оставили». Irene открывает запечатанное дело и предупреждает: кто-то переписал не только записи о погибшей, но и сам язык расследования.',vocab:['sealed file — запечатанное дело','rewrite — переписывать','leave behind — оставлять после себя'],cls:'irene-scene',img:'irene',button:{A1:'Начать осмотр',A2:'Begin inspection',B1:'Begin inspection'}},
 morwen:{name:'Lady Morwen',role:'Minister of Memory',badge:'Ministry transmission',quote:'“This case is no longer under your authority. Record the death. Seal the apartment. Forget the woman.”',context:'A violet Ministry seal ignites above the mirror. Lady Morwen appears through the projection and orders you to close the investigation before the evidence can enter the public record.',ru:'«Это дело больше не находится в вашей юрисдикции. Зафиксируйте смерть. Опечатайте квартиру. Забудьте эту женщину». Леди Морвен требует прекратить расследование до того, как улики попадут в официальные записи.',vocab:['authority — полномочия','seal — опечатать','public record — официальная запись'],cls:'morwen-scene',img:'morwen',button:{A1:'Продолжить расследование',A2:'Continue the investigation',B1:'Continue the investigation'}},
 oren:{name:'Oren Thale',role:'Memory Physician',badge:'Encrypted medical message',quote:'“That ampoule was not made to erase a memory. It was made to preserve one inside a living body.”',context:'The empty Ministry ampoule releases a green pulse. A hidden medical signature identifies Oren Thale, a physician whose treatments can restore memories—or create convincing replacements.',ru:'«Эта ампула была создана не для стирания воспоминания. Она должна была сохранить его внутри живого тела». Скрытая медицинская подпись принадлежит Орену Тейлу — врачу, способному восстановить память или создать убедительную подмену.',vocab:['preserve — сохранять','living body — живое тело','replacement — замена'],cls:'oren-scene',img:'oren',button:{A1:'Вернуться к уликам',A2:'Return to the clues',B1:'Return to the clues'}},
 silas:{name:'Silas Vane',role:'Former Royal Investigator',badge:'Witness arrival',quote:'“You are looking for a dead woman. I am here because she was looking for you.”',context:'The apartment door opens without a sound. Silas Vane enters in a rain-soaked coat and places an old royal badge beside the mirror. He knows the victim’s name—and the name you had before the Archive.',ru:'«Вы ищете погибшую женщину. Я пришёл потому, что она искала вас». Сайлас Вейн входит в квартиру и кладёт рядом с зеркалом старый королевский жетон. Он знает имя погибшей — и имя, которое было у вас до Архива.',vocab:['be looking for — искать','rain-soaked — промокший под дождём','badge — жетон'],cls:'silas-scene',img:'silas',button:{A1:'Начать допрос',A2:'Begin the interrogation',B1:'Begin the interrogation'}},
 queen:{name:'The Nameless Queen',role:'Mirror Sovereign',badge:'Memory fracture',quote:'“They did not save your city. They taught it to remember the wrong life.”',context:'The interrogation room disappears from the mirror. A crowned figure watches from behind fractured glass. Her face changes every time you blink, but her voice remains inside your own memory.',ru:'«Они не спасли ваш город. Они научили его помнить неправильную жизнь». Комната для допросов исчезает в зеркале. За разбитым стеклом появляется коронованная фигура, чьё лицо меняется каждый раз, когда вы моргаете.',vocab:['fractured glass — разбитое стекло','the wrong life — неправильная жизнь','remain — оставаться'],cls:'queen-scene',img:'queen',button:{A1:'Сформировать отчёт',A2:'Write the report',B1:'Write the report'}},
 kael:{name:'Kael Dusk',role:'Shadow Hunter',badge:'Post-credits / Next case',quote:'“The thing beneath Evervale has started moving again. And this time, it remembers your scent.”',context:'Beyond the city walls, Kael Dusk finds fresh tracks around a sealed stone gate. The marks do not lead into the forest. They lead upward—toward Evervale.',ru:'«То, что находится под Эвервейлом, снова пришло в движение. И теперь оно помнит ваш запах». За городскими стенами Каэль Даск находит свежие следы у запечатанных каменных ворот. Они ведут не в лес, а к самому городу.',vocab:['beneath — под','fresh tracks — свежие следы','sealed gate — запечатанные ворота'],cls:'kael-scene',img:'kael',button:{A1:'Вернуться к финалу',A2:'Return to the ending',B1:'Return to the ending'}}
};
function showAppearance(key,next){appearanceKey=key;appearanceNext=next||'investigation';const d=appearanceData[key];const art=document.getElementById('appearanceArt');art.className='appearance-art img-'+d.img;const copy=document.getElementById('appearanceCopy');copy.className='appearance-copy '+d.cls;document.getElementById('appearanceBadge').textContent=d.badge;document.getElementById('appearanceName').textContent=d.name;document.getElementById('appearanceRole').textContent=d.role;document.getElementById('appearanceQuote').textContent=d.quote;document.getElementById('appearanceContext').textContent=d.context;const tr=document.getElementById('appearanceTranslation');tr.textContent=d.ru;tr.classList.toggle('hidden',(state.level!=='A1'&&state.level!=='A0'));const tb=document.getElementById('appearanceTranslateBtn');tb.classList.toggle('hidden',state.level!=='A2');document.getElementById('appearanceVocab').innerHTML=(isEnglishLevel(state.level)?[]:d.vocab).map(v=>'<span>'+v+'</span>').join('');document.getElementById('appearanceContinueBtn').textContent=d.button[state.level]||d.button[{A0:'A1',B2:'B1',C1:'B1'}[state.level]]||d.button.A2;go('appearance')}
function continueAppearance(){clickSfx();go(appearanceNext)}
function showPostCredits(){if(state.kaelSeen){go('start');return}state.kaelSeen=true;save();showAppearance('kael','ending')}

function normaliseState(s){s={...initial,...(s||{})};s.alignment={...initial.alignment,...(s.alignment||{})};s.bonds={...initial.bonds,...(s.bonds||{})};s.campaignHistory=Array.isArray(s.campaignHistory)?s.campaignHistory:[];s.secrets=Array.isArray(s.secrets)?s.secrets:[];s.hiddenFound=Array.isArray(s.hiddenFound)?s.hiddenFound:[];return s}let volatileSave=null;function save(){try{volatileSave=JSON.stringify(state);localStorage.setItem('evervale-v11',volatileSave)}catch(e){volatileSave=JSON.stringify(state)}}
function isEnglishLevel(level){return ['B1','B2','C1'].includes(level)}

function load(){try{const raw=localStorage.getItem('evervale-v11')||localStorage.getItem('evervale-v10')||localStorage.getItem('evervale-v9')||localStorage.getItem('evervale-v8');return raw?JSON.parse(raw):null}catch(e){try{return volatileSave?JSON.parse(volatileSave):null}catch(_){return null}}}
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const target=document.getElementById(id);if(!target)return;target.classList.add('active');if(id==='analysisboard')renderAnalysisBoard();if(id==='hiddenstudy')renderHiddenStudy();if(id==='caretaker')renderCaretaker();if(id==='longcase')renderLongCase();if(id==='memory'&&state.memoryStage===0)setupWords();if(id==='memorytrace')renderMemoryTrace();if(id==='interrogation')renderQuestion();if(id==='verdict')renderVerdict();if(id==='campaign')renderCampaign();window.scrollTo(0,0);save()}
function openCodex(from){codexBack=from||'intro';go('codex')}
function closeCodex(){go(codexBack||'intro')}
function selectLevel(level){state=normaliseState({...initial,level,protagonist:state.protagonist||'female',music:state.music});save();go('character');if(state.music)startMusic()}
function continueGame(){const s=load();if(!s||!s.level){go('level');return}state=normaliseState(s);if(!state.protagonist){go('character');return}applyLanguage();renderProtagonist();if(state.music)startMusic();if(state.campaignNode){go('campaign');return}if(state.question>=dialogue.length){go('verdict');return}if(state.deepMemoryDone){go('interrogation');return}if(state.memoryTraceStep>0||state.memoryStage===1){go('memorytrace');return}if(state.longCaseDone){go('memory');return}if(state.longCaseStep>0||state.caretakerStep>=caretakerDialogue.length){go('longcase');return}if(state.hiddenFound.length===4){go('caretaker');return}if(state.analysisStep>=analysisQuestions.length){go('hiddenstudy');return}if(state.found.length===4){go('analysisboard');return}go('investigation')}
function restart(){const m=state.music;state=normaliseState({...initial,music:m});save();document.getElementById('levelIndicator').classList.add('hidden');go('level')}
function selectCharacter(p){state.protagonist=p;save();applyLanguage();renderProtagonist();go('intro');if(state.music)startMusic()}
function renderProtagonist(){const p=state.protagonist||'female';const titleMap={female: isEnglishLevel(state.level) ? 'Elara Vane · Archivist Investigator' : 'Элара Вейн · архивист-исследователь', male: isEnglishLevel(state.level) ? 'Arden Vane · Archivist Investigator' : 'Арден Вейн · архивист-исследователь'};['chooseFemale','chooseMale'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('selected')});const selected=document.getElementById(p==='female'?'chooseFemale':'chooseMale');if(selected)selected.classList.add('selected');['introPortrait','introMini','investMini','dialogueMini'].forEach(id=>{const el=document.getElementById(id);if(el){el.classList.remove('female','male');el.classList.add(p)}});['investProfileName','dialogueProfileName','introProfileLabel'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=titleMap[p]})}
function t(){return UI[state.level]||UI.A1}
function applyLanguage(){const u=t();document.documentElement.lang=isEnglishLevel(state.level)?'en':'ru';const map={brand1:u.brand,labelEvidence:u.evidence,labelStability:u.stability,labelInfluence:u.influence,musicBtn1:u.music,introKicker:u.introK,introTitle:u.introT,introP1:u.intro1,introP2:u.intro2,introBtn:u.introB,investKicker:u.investK,investTitle:u.investT,investProgress:u.progress,sceneTime:u.time,sceneDescription:u.scene,sceneTranslation:u.sceneRu,caseMaterials:u.materials,caseLead:u.lead,memoryBtn:u.memory,memoryBrand:u.memoryBrand,memoryKicker:u.memoryK,sentence:u.sentence,resetBtn:u.reset,memoryHintBtn:u.memoryHint,memoryStability:u.stability,musicBtn2:u.music,interrogationBrand:u.brand,labelTrust:u.trust,labelInfluence2:u.influence,musicBtn3:u.music,witnessLabel:u.witness,silasRole:u.role,verdictBrand:u.verdictBrand,trustFinalLabel:u.trust,verdictKicker:u.verdictK,verdictTitle:u.verdictT,verdictContext:u.verdictC,musicBtn4:u.music,endingKicker:u.endK,restartBtn:u.restart,menuBtn:u.menu,ireneRole:u.ireneRole,codexBtnIntro:isEnglishLevel(state.level)?'Character Codex':'Кодекс героев',codexBtnInvest:isEnglishLevel(state.level)?'Character Codex':'Кодекс героев',postCreditsBtn:isEnglishLevel(state.level)?'Post-credits / Next case':'Сцена после титров'};Object.entries(map).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});document.getElementById('levelIndicator').textContent='ENGLISH MODE · '+state.level+(isEnglishLevel(state.level)?'+':'');document.getElementById('levelIndicator').classList.add('hidden');document.getElementById('sceneTranslation').classList.toggle('hidden',(state.level!=='A1'&&state.level!=='A0'));document.getElementById('memoryHintBtn').classList.toggle('hidden',isEnglishLevel(state.level));renderEvidence();updateUI();renderProtagonist();updateMusicButtons()}
function renderEvidence(){const box=document.getElementById('evidenceList');box.innerHTML='';clues.forEach((c,i)=>{const found=state.found.includes(i+1);let extra='';if((state.level==='A1'||state.level==='A0'))extra=`<small class="translation">${c.ru}</small><small>${c.words}</small>`;else if(state.level==='A2')extra=`<small class="translation hidden" id="clueRu${i}">${c.ru}</small>`;box.innerHTML+=`<div class="evidence ${found?'':'locked'}" id="e${i+1}"><div class="num">0${i+1}</div><div><b>${c.en}</b><small>${c.desc}</small>${extra}</div></div>`});const tools=document.getElementById('investTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML=`<button class="tool-btn" onclick="toggleClueTranslations()">Show / hide clue translations</button><button class="tool-btn" onclick="showInvestHint()">Vocabulary hint</button>`;if((state.level==='A1'||state.level==='A0'))document.getElementById('investHint').textContent='Подсказка: осматривайте зеркало, стол, ковёр и область у окна.'}
function toggleClueTranslations(){document.querySelectorAll('[id^=clueRu]').forEach(e=>e.classList.toggle('hidden'))}function showInvestHint(){const h=document.getElementById('investHint');h.textContent='wardrobe — шкаф · evidence — улика · trace — след · reflection — отражение';h.classList.toggle('hidden')}
function findEvidence(n){clickSfx();if(state.found.includes(n))return;state.found.push(n);const msg=isEnglishLevel(state.level)?['The thread carries your Archive cipher.','The mirror whispers the name “Elara”.','The letter opens at the phrase: “The city died before.”','The ampoule predates your official birth.'][n-1]:['На нити обнаружен ваш архивный шифр.','Зеркало произносит имя: «Элара».','Письмо открывается на фразе: “The city died before.”','Ампула изготовлена раньше вашей официальной даты рождения.'][n-1];toast(msg);renderEvidence();updateUI();save();if(state.found.length===2&&!state.morwenSeen){state.morwenSeen=true;save();setTimeout(()=>showAppearance('morwen','investigation'),700);return}if(state.found.length===4&&!state.orenSeen){state.orenSeen=true;save();setTimeout(()=>showAppearance('oren','investigation'),700);return}if(state.found.length===4)showIrene(isEnglishLevel(state.level)?'All four clues are connected by one idea: the victim knew a version of you that the Archive officially denies.':'Все четыре улики связаны одной идеей: погибшая знала версию вас, существование которой Архив отрицает.')}

function renderAnalysisBoard(){
 const q=analysisQuestions[state.analysisStep];if(!q){go('hiddenstudy');return}
 const a1=(state.level==='A1'||state.level==='A0'),b1=isEnglishLevel(state.level);
 document.getElementById('analysisScore').textContent=state.analysisScore+'/4';document.getElementById('analysisStability').textContent=state.stability;document.getElementById('analysisProgress').textContent=(state.analysisStep+1)+' / '+analysisQuestions.length;
 document.getElementById('analysisTitle').textContent=b1?'Build the Timeline':'Постройте временную линию';document.getElementById('analysisIntro').textContent=b1?'Connect the physical evidence before entering the victim’s memory. A wrong conclusion may make the later reconstruction less stable.':'Свяжите вещественные улики до погружения в память погибшей. Ошибочный вывод сделает последующую реконструкцию менее стабильной.';
 document.getElementById('analysisQuestion').textContent=b1?q.q:q.qRu;document.getElementById('analysisContext').textContent=b1?q.context:q.contextRu;
 const tr=document.getElementById('analysisTranslation');tr.textContent=q.qRu+'\n'+q.contextRu;tr.classList.toggle('hidden',!a1);
 const tools=document.getElementById('analysisTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML='<button class="tool-btn" onclick="toggleBox(\'analysisTranslation\')">Show translation</button>';
 const box=document.getElementById('analysisOptions');box.innerHTML='';q.options.forEach((o,i)=>{const btn=document.createElement('button');btn.className='analysis-option';btn.innerHTML=o[0]+(a1?'<span class="ru">'+o[1]+'</span>':'');btn.onclick=()=>answerAnalysis(o[2],q.feedback);box.appendChild(btn)});updateMusicButtons();
}
function answerAnalysis(correct,feedback){clickSfx();if(correct){state.analysisScore++;toast(isEnglishLevel(state.level)?'Deduction confirmed':'Вывод подтверждён')}else{state.stability=Math.max(45,state.stability-4);toast(isEnglishLevel(state.level)?'The evidence does not support that conclusion':'Улики не подтверждают этот вывод')}state.analysisStep++;save();showIrene(isEnglishLevel(state.level)?feedback:'Комментарий: '+feedback);setTimeout(()=>{closeIrene();state.analysisStep>=analysisQuestions.length?go('hiddenstudy'):renderAnalysisBoard()},1100)}
function renderHiddenStudy(){const a1=(state.level==='A1'||state.level==='A0'),b1=isEnglishLevel(state.level);document.getElementById('hiddenEvidenceLabel').textContent=b1?'Hidden clues':'Скрытые улики';document.getElementById('hiddenEvidenceStat').textContent=state.hiddenFound.length+'/4';document.getElementById('hiddenStability').textContent=state.stability;document.getElementById('studyTitle').textContent=b1?'The Room Behind the Wall':'Комната за стеной';document.getElementById('studyIntro').textContent=b1?'Your deductions activate a concealed mechanism in the mirror frame. A second room opens behind the apartment wall.':'Ваши выводы активируют скрытый механизм в раме зеркала. За стеной квартиры открывается вторая комната.';document.getElementById('studyDescription').textContent=b1?'The annex contains objects collected across several versions of the same crime scene. Dust lies everywhere except on the chair facing the mirror.':'В тайной комнате хранятся предметы из нескольких версий одного места преступления. Пыль лежит везде, кроме стула напротив зеркала.';document.getElementById('studyMaterials').textContent=b1?'Recovered material':'Найденные материалы';document.getElementById('studyLead').textContent=b1?'Find four objects that explain why Apartment 17 appears in several buildings.':'Найдите четыре предмета, объясняющих, почему квартира №17 отмечена в нескольких зданиях.';document.getElementById('studyProgress').textContent=b1?'Find four hidden clues':'Найдите четыре скрытые улики';document.getElementById('caretakerBtn').textContent=b1?'Question the caretaker':'Допросить смотрительницу';document.getElementById('caretakerBtn').disabled=state.hiddenFound.length<4;
 const box=document.getElementById('hiddenEvidenceList');box.innerHTML='';hiddenClues.forEach((c,i)=>{const found=state.hiddenFound.includes(i+1);let extra='';if(a1)extra='<small class="translation">'+c.ru+'</small><small>'+c.words+'</small>';else if(state.level==='A2')extra='<small class="translation hidden" id="hiddenRu'+i+'">'+c.ru+'</small>';box.innerHTML+='<div class="study-clue '+(found?'':'locked')+'"><div class="sig">0'+(i+1)+'</div><div><b>'+c.en+'</b><small>'+c.desc+'</small>'+extra+'</div></div>'});
 const tools=document.getElementById('studyTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML='<button class="tool-btn" onclick="toggleHiddenTranslations()">Show / hide translations</button>';if(a1){document.getElementById('studyHint').textContent='Подсказка: осмотрите полку слева, верхнюю часть стены, стол и область возле стула.';document.getElementById('studyHint').classList.remove('hidden')}else document.getElementById('studyHint').classList.add('hidden');
 for(let i=1;i<=4;i++){const h=document.getElementById('sh'+i);if(h){const f=state.hiddenFound.includes(i);h.classList.toggle('found',f);if(f)h.textContent='✓'}}updateMusicButtons();
}
function findHiddenEvidence(n){clickSfx();if(state.hiddenFound.includes(n))return;state.hiddenFound.push(n);const msg=isEnglishLevel(state.level)?['The recording uses your voice.','Seventeen locations share the same apartment number.','The photograph was taken before your registered birth.','Mara Holt’s voiceprint is sealed inside.'][n-1]:['В записи звучит ваш голос.','Один номер квартиры связан с семнадцатью адресами.','Фотография сделана до вашего официального рождения.','В печати обнаружен голосовой след Мары Холт.'][n-1];toast(msg);save();renderHiddenStudy();if(state.hiddenFound.length===4)showIrene(isEnglishLevel(state.level)?'The hidden room turns the crime scene into a network. Mara Holt is no longer only a caretaker; she is connected to the memory seals.':'Тайная комната превращает место преступления в целую сеть. Мара Холт связана с печатями памяти и должна быть допрошена.')}
function toggleHiddenTranslations(){hiddenClues.forEach((_,i)=>{const e=document.getElementById('hiddenRu'+i);if(e)e.classList.toggle('hidden')})}
function renderCaretaker(){if(state.caretakerStep>=caretakerDialogue.length){save();go('longcase');return}const q=caretakerDialogue[state.caretakerStep],a1=(state.level==='A1'||state.level==='A0'),b1=isEnglishLevel(state.level);document.getElementById('caretakerTrustStat').textContent=state.caretakerTrust;document.getElementById('caretakerInfluence').textContent=state.influence;document.getElementById('caretakerProgress').textContent=(b1?'Question ':'Вопрос ')+(state.caretakerStep+1)+' / '+caretakerDialogue.length;document.getElementById('caretakerRole').textContent=b1?'Caretaker of the Upper District residence':'Смотрительница дома в Верхнем квартале';document.getElementById('caretakerContext').textContent=a1?q.contextRu:q.context;document.getElementById('caretakerSpeech').textContent='“'+q.speech+'”';const tr=document.getElementById('caretakerTranslation');tr.textContent=q.ru;tr.classList.toggle('hidden',!a1);const vocab=document.getElementById('caretakerVocab');vocab.innerHTML=q.vocab.map(v=>'<span>'+v+'</span>').join('');vocab.classList.toggle('hidden',!a1);const tools=document.getElementById('caretakerTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML='<button class="tool-btn" onclick="toggleBox(\'caretakerTranslation\')">Show translation</button><button class="tool-btn" onclick="toggleBox(\'caretakerVocab\')">Vocabulary</button>';const choices=document.getElementById('caretakerChoices');choices.innerHTML='';q.choices.forEach(c=>{const btn=document.createElement('button');btn.className='choice';btn.innerHTML='<small>'+c.tone+'</small>'+c.en+(a1?'<span class="ru">'+c.ru+'</span>':'');btn.onclick=()=>answerCaretaker(c);choices.appendChild(btn)});updateMusicButtons()}
function answerCaretaker(c){clickSfx();state.caretakerTrust+=c.trust;state.influence+=c.influence;state.caretakerStep++;save();showIrene(isEnglishLevel(state.level)?c.fb:'Комментарий: '+c.fb);setTimeout(()=>{closeIrene();renderCaretaker()},1100)}
function renderMemoryTrace(){if(state.memoryTraceStep>=memoryTraceQuestions.length){state.deepMemoryDone=true;save();if(!state.silasSeen){state.silasSeen=true;showAppearance('silas','interrogation')}else go('interrogation');return}const q=memoryTraceQuestions[state.memoryTraceStep],a1=(state.level==='A1'||state.level==='A0'),b1=isEnglishLevel(state.level);document.getElementById('memoryTraceProgress').textContent=(state.memoryTraceStep+1)+'/'+memoryTraceQuestions.length;document.getElementById('memoryTraceStability').textContent=state.stability;document.getElementById('memoryTraceTitle').textContent=b1?q.title:q.titleRu;document.getElementById('memoryTraceContext').textContent=b1?q.context:q.contextRu;document.getElementById('memoryFragment').textContent='“'+q.fragment+'”';const tr=document.getElementById('memoryTraceTranslation');tr.textContent=q.fragmentRu+'\n\n'+q.contextRu;tr.classList.toggle('hidden',!a1);const tools=document.getElementById('memoryTraceTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML='<button class="tool-btn" onclick="toggleBox(\'memoryTraceTranslation\')">Show translation</button>';const box=document.getElementById('memoryTraceOptions');box.innerHTML='';q.options.forEach(o=>{const btn=document.createElement('button');btn.className='memory-trace-option';btn.innerHTML=o[0]+(a1?'<span class="ru" style="display:block;margin-top:7px;color:#bcb4bd">'+o[1]+'</span>':'');btn.onclick=()=>answerMemoryTrace(o[2],q.feedback);box.appendChild(btn)});updateMusicButtons()}
function answerMemoryTrace(correct,feedback){clickSfx();if(!correct){state.stability=Math.max(40,state.stability-4);toast(isEnglishLevel(state.level)?'The fragment destabilises':'Фрагмент становится нестабильным')}else toast(isEnglishLevel(state.level)?'Memory fragment verified':'Фрагмент памяти подтверждён');state.memoryTraceStep++;save();showIrene(isEnglishLevel(state.level)?feedback:'Комментарий: '+feedback);setTimeout(()=>{closeIrene();renderMemoryTrace()},1100)}

function setupWords(){const words=['The','city','did','not','survive','—','it','was','rewritten'];state.words=[];const b=document.getElementById('wordbank');b.innerHTML='';[...words].sort(()=>Math.random()-.5).forEach(w=>{const x=document.createElement('button');x.className='word';x.textContent=w;x.onclick=()=>chooseWord(w,x);b.appendChild(x)});document.getElementById('sentence').textContent=t().sentence;document.getElementById('memoryTranslation').textContent=isEnglishLevel(state.level)?'':(state.level==='A1'||state.level==='A0')?'Город не выжил — его переписали. Подсказка: did not + глагол; was + V3.':'Translation: Город не выжил — его переписали.';document.getElementById('memoryTranslation').classList.toggle('hidden',(state.level!=='A1'&&state.level!=='A0'))}
function resetWords(){setupWords();clickSfx()}function chooseWord(w,e){clickSfx(840,.02,.05);state.words.push(w);e.classList.add('used');const current=state.words.join(' '),target='The city did not survive — it was rewritten';document.getElementById('sentence').textContent=current;if(!target.startsWith(current)){state.stability=Math.max(55,state.stability-5);updateUI();showIrene(isEnglishLevel(state.level)?'The word order is incorrect. Remember the passive pattern: subject + was + past participle.':'Порядок слов неверный. В пассивной конструкции используйте: подлежащее + was + третья форма глагола.');setTimeout(setupWords,900)}else if(current===target){state.stability=Math.max(55,state.stability-8);updateUI();showIrene(isEnglishLevel(state.level)?'The sentence is complete. The passive voice deliberately hides who rewrote the city.':'Фраза восстановлена. Пассивный залог намеренно скрывает того, кто переписал город.');state.memoryStage=1;save();setTimeout(()=>go('memorytrace'),1250)}}
function renderQuestion(){if(state.question>=dialogue.length){if(!state.queenSeen){state.queenSeen=true;save();showAppearance('queen','verdict')}else go('verdict');return}const q=dialogue[state.question];document.getElementById('questionProgress').textContent=`${t().q} ${state.question+1} ${t().of} ${dialogue.length}`;document.getElementById('speech').textContent='“'+q.speech+'”';document.getElementById('context').textContent=(state.level==='A1'||state.level==='A0')?q.contextRu:q.context;const tr=document.getElementById('speechTranslation');tr.textContent=q.ru;tr.classList.toggle('hidden',(state.level!=='A1'&&state.level!=='A0'));const vocab=document.getElementById('vocab');vocab.innerHTML=q.vocab.map(v=>`<span>${v}</span>`).join('');vocab.classList.toggle('hidden',(state.level!=='A1'&&state.level!=='A0'));const tools=document.getElementById('dialogueTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML='<button class="tool-btn" onclick="toggleBox(\'speechTranslation\')">Show translation</button><button class="tool-btn" onclick="toggleBox(\'vocab\')">Vocabulary</button>';const choices=document.getElementById('choices');choices.innerHTML='';q.choices.forEach(c=>{const b=document.createElement('button');b.className='choice';b.innerHTML=`<small>${c.tone}</small>${c.en}${(state.level==='A1'||state.level==='A0')?`<span class="ru">${c.ru}</span>`:''}`;b.onclick=()=>answer(c);choices.appendChild(b)});updateUI()}
function answer(c){clickSfx();state.trust+=c.trust;state.influence+=c.influence;state.question++;updateUI();save();showIrene(isEnglishLevel(state.level)?c.fbEn:c.fbRu+(state.level==='A2'?' '+c.fbEn:''));setTimeout(renderQuestion,1250)}
function renderVerdict(){document.getElementById('trustFinal').textContent=state.trust;document.getElementById('evidenceFinal').textContent=(state.level==='A1'||state.level==='A0')?'Материалы дела 52/52':'Case materials 52/52';const box=document.getElementById('verdictChoices');box.innerHTML='';verdicts[state.level].forEach(v=>{box.innerHTML+=`<button class="verdict" onclick="finish('${v[3]}')"><div class="tag">${v[0]}</div><h3>${v[1]}</h3><p>${v[2]}</p></button>`})}

const longCaseSegments=[];
const longCaseNodes=[];

function renderLongCase(){
 if(state.longCaseStep>=longCaseNodes.length){state.longCaseDone=true;state.memoryStage=0;save();showIrene(isEnglishLevel(state.level)?'The extended case file is complete. You now have enough evidence to enter the victim’s memory without relying on the Ministry’s version.':'Расширенное досье завершено. Теперь у вас достаточно улик, чтобы войти в память погибшей, не полагаясь на версию Министерства.');setTimeout(()=>{closeIrene();go('memory')},1200);return}
 const n=longCaseNodes[state.longCaseStep],s=longCaseSegments[n.seg],a1=(state.level==='A1'||state.level==='A0'),b1=isEnglishLevel(state.level);
 document.getElementById('longCaseTopProgress').textContent=(state.longCaseStep+1)+'/'+longCaseNodes.length;
 document.getElementById('longCaseScore').textContent=state.longCaseScore;
 document.getElementById('longCaseStability').textContent=state.stability;
 document.getElementById('longCaseKicker').textContent=b1?s.k:s.kRu;
 document.getElementById('longCaseHeading').textContent=b1?s.title:s.titleRu;
 document.getElementById('longCaseSegment').textContent=(b1?'Section ':'Раздел ')+(n.seg+1)+' / '+longCaseSegments.length;
 document.getElementById('longCaseEstimate').textContent=b1?'Estimated first case: 1 h 45–2 h 15':'Расчётное время первого дела: 1 ч 45 мин – 2 ч 15 мин';
 document.getElementById('longCaseChapter').textContent=b1?s.title:s.titleRu;
 document.getElementById('longCaseChapterDesc').textContent=b1?s.desc:s.descRu;
 document.getElementById('longCaseSymbol').textContent=s.symbol;
 document.getElementById('longCaseLocation').textContent=n.loc;
 document.getElementById('longCaseTitle').textContent=(b1||state.level==='A2')?n.title:n.titleRu;
 document.getElementById('longCaseBody').textContent=n.body;
 document.getElementById('longCaseTask').textContent=n.task;
 const tr=document.getElementById('longCaseTranslation');tr.textContent=n.bodyRu+'\n\n'+n.taskRu;tr.classList.toggle('hidden',!a1);
 const voc=document.getElementById('longCaseVocab');voc.innerHTML=b1?'':n.vocab.map(v=>'<span>'+v+'</span>').join('');
 const tools=document.getElementById('longCaseTools');tools.innerHTML='';if(state.level==='A2')tools.innerHTML='<button class="tool-btn" onclick="toggleBox(\'longCaseTranslation\')">Show translation</button>';
 const box=document.getElementById('longCaseOptions');box.innerHTML='';n.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='long-case-option';b.innerHTML='<small>'+o.tag+'</small>'+o.en+(a1?'<span class="ru">'+o.ru+'</span>':'');b.onclick=()=>answerLongCase(i);box.appendChild(b)});
 const pct=((state.longCaseStep+1)/longCaseNodes.length)*100;document.getElementById('longCaseBar').style.width=pct+'%';
 document.getElementById('longCaseFacts').textContent=state.longCaseFacts;document.getElementById('longCaseMistakes').textContent=state.longCaseMistakes;document.getElementById('longCaseWitnesses').textContent=state.longCaseWitnesses;document.getElementById('longCaseDocuments').textContent=state.longCaseDocuments;updateMusicButtons();
}
function answerLongCase(index){
 clickSfx();const n=longCaseNodes[state.longCaseStep],correct=index===n.correct;
 if(correct){state.longCaseScore++;state.longCaseFacts+=n.fact||0;state.longCaseWitnesses+=n.witness||0;state.longCaseDocuments+=n.doc||0;toast(isEnglishLevel(state.level)?'Deduction verified':'Вывод подтверждён')}else{state.longCaseMistakes++;state.stability=Math.max(35,state.stability-2);toast(isEnglishLevel(state.level)?'The conclusion creates a contradiction':'Вывод создаёт противоречие')}
 state.longCaseStep++;save();setTimeout(renderLongCase,correct?520:2600);
}

const campaignNodes={};
const campaignEndings={};
function campaignRouteName(){const names={order:isEnglishLevel(state.level)?'Order route':'Линия порядка',truth:isEnglishLevel(state.level)?'Resistance route':'Линия сопротивления',personal:isEnglishLevel(state.level)?'Secret Archive route':'Линия тайного Архива'};return names[state.route]||''}
function startCampaign(type){state.route=type;state.campaignNode={order:'ministry_start',truth:'truth_start',personal:'personal_start'}[type];state.campaignHistory=[];state.alignment={...initial.alignment};state.bonds={...initial.bonds,silas:Math.max(0,state.trust)};state.secrets=[];save();go('campaign')}
function hasSecret(name){if(name==='irene_origin_or_grammar')return state.secrets.includes('irene_origin')||state.secrets.includes('grammar_key')||state.secrets.includes('third_tense');if(name==='lyra')return state.secrets.some(s=>['lyra_inside','lyra_body','lyra_vessel'].includes(s));return state.secrets.includes(name)}
function choiceAllowed(c){const r=c.requires;if(!r)return true;if(r.align)return (state.alignment[r.align]||0)>=(r.min||0);if(r.bond)return (state.bonds[r.bond]||0)>=(r.min||0);if(r.secret)return hasSecret(r.secret);return true}
function applyCampaignEffects(e){if(!e)return;if(typeof e.stability==='number')state.stability=Math.max(0,Math.min(120,state.stability+e.stability));if(typeof e.influence==='number')state.influence+=e.influence;if(typeof e.trust==='number')state.trust+=e.trust;if(e.align)Object.entries(e.align).forEach(([k,v])=>state.alignment[k]=(state.alignment[k]||0)+v);if(e.bonds)Object.entries(e.bonds).forEach(([k,v])=>state.bonds[k]=(state.bonds[k]||0)+v);if(e.addSecret&&!state.secrets.includes(e.addSecret))state.secrets.push(e.addSecret)}
function renderCampaign(){const n=campaignNodes[state.campaignNode];if(!n){go('ending');return}const b1=isEnglishLevel(state.level),a1=(state.level==='A1'||state.level==='A0');document.getElementById('campaignChapter').textContent=b1?n.chapter:n.chapterRu;document.getElementById('campaignRoute').textContent=campaignRouteName();document.getElementById('campaignKicker').textContent=n.kicker;document.getElementById('campaignTitle').textContent=b1?n.title:n.titleRu;const echoNode=state.campaignNode==='archive_echo';document.getElementById('campaignSpeaker').textContent=echoNode?(state.protagonist==='male'?'Arden Echo':'Elara Echo'):n.speaker;document.getElementById('campaignRole').textContent=b1?n.role:n.roleRu;document.getElementById('campaignQuote').textContent='“'+n.quote+'”';document.getElementById('campaignBody').textContent=n.body;const art=document.getElementById('campaignArt');const artKey=echoNode?(state.protagonist==='male'?'arden':'elara'):n.img;art.className='campaign-art img-'+artKey;const tr=document.getElementById('campaignTranslation');tr.textContent='«'+n.quoteRu+'»\n\n'+n.bodyRu;tr.classList.toggle('hidden',!a1);const vocab=document.getElementById('campaignVocab');vocab.innerHTML=b1?'':(n.vocab||[]).map(v=>'<span>'+v+'</span>').join('');const tools=document.getElementById('campaignTools');tools.innerHTML='';if(state.level==='A2'){const tbtn=document.createElement('button');tbtn.className='tool-btn';tbtn.textContent='Show translation';tbtn.onclick=()=>toggleBox('campaignTranslation');tools.appendChild(tbtn)}const choices=document.getElementById('campaignChoices');choices.innerHTML='';(n.choices||[]).filter(choiceAllowed).forEach((c,i)=>{const btn=document.createElement('button');btn.className='campaign-choice';btn.innerHTML='<small>'+c.tag+'</small>'+c.en+(a1?'<span class="ru">'+c.ru+'</span>':'');btn.onclick=()=>chooseCampaign(c);choices.appendChild(btn)});document.getElementById('campaignStability').textContent=state.stability;document.getElementById('campaignInfluence').textContent=state.influence;document.getElementById('campaignSilas').textContent=state.bonds.silas||0;document.getElementById('campaignIrene').textContent=state.bonds.irene||0;document.getElementById('campaignLength').textContent=b1?'Your choices open different scenes, alliances, hidden revelations, and six possible endings.':'Ваши решения открывают разные сцены, союзы, скрытые откровения и шесть возможных финалов.';updateMusicButtons()}
function chooseCampaign(c){clickSfx();applyCampaignEffects(c.effects);state.campaignHistory.push(state.campaignNode);if(c.ending){completeCampaign(c.ending);return}state.campaignNode=c.next;save();renderCampaign();window.scrollTo(0,0)}
function completeCampaign(key){const e=campaignEndings[key]||campaignEndings.destroy;const b1=isEnglishLevel(state.level);document.getElementById('endingKicker').textContent=b1?'END OF THE LONG CAMPAIGN':'ФИНАЛ БОЛЬШОЙ КАМПАНИИ';document.getElementById('endingTitle').textContent=b1?e.enTitle:e.ruTitle;document.getElementById('endingText').textContent=b1?e.en:e.ru;const route=campaignRouteName();const stats=b1?'Route: '+route+' · Chapters completed: '+state.campaignHistory.length+' · Secrets found: '+state.secrets.length:'Линия: '+route+' · Пройдено сцен: '+state.campaignHistory.length+' · Найдено секретов: '+state.secrets.length;document.getElementById('endingResult').textContent=(b1?e.resultEn:e.resultRu)+'\n'+stats;state.campaignNode=null;save();go('ending')}
function finish(type){startCampaign(type)}

function updateUI(){document.getElementById('evidenceStat').textContent=state.found.length+'/4';document.getElementById('stabilityStat').textContent=state.stability;document.getElementById('stabilityStat2').textContent=state.stability;document.getElementById('influenceStat').textContent=state.influence;document.getElementById('influenceStat2').textContent=state.influence;document.getElementById('trustStat').textContent=state.trust;document.getElementById('memoryBtn').disabled=state.found.length<4;const hs=document.getElementById('hiddenEvidenceStat');if(hs)hs.textContent=state.hiddenFound.length+'/4';for(let i=1;i<=4;i++){const h=document.getElementById('h'+i);if(h){const f=state.found.includes(i);h.classList.toggle('found',f);if(f)h.textContent='✓'}}}
function toggleBox(id){document.getElementById(id).classList.toggle('hidden')}function showIrene(text){document.getElementById('ireneText').textContent=text;document.getElementById('irene').classList.add('show')}function closeIrene(){document.getElementById('irene').classList.remove('show')}function toast(text){const e=document.getElementById('toast');e.textContent=text;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1900)}
let sfxCtx=null;
function getAmbient(){return document.getElementById('ambientAudio')}
function updateMusicButtons(){const on=!!state.music;const ru=!isEnglishLevel(state.level);const label=ru?(on?'♫ Музыка: вкл':'♫ Музыка: выкл'):(on?'♫ Music: on':'♫ Music: off');['musicBtnStart','musicBtn1','musicBtn2','musicBtn3','musicBtn4','musicBtnCampaign','musicBtnAnalysis','musicBtnStudy','musicBtnCaretaker','musicBtnTrace'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=label});const ind=document.getElementById('audioIndicator');if(ind)ind.textContent=ru?(on?'♫ Музыка включена':'♫ Музыка выключена'):(on?'♫ Music on':'♫ Music off')}
async function startMusic(){const a=getAmbient();if(!a)return;a.volume=.58;try{await a.play();state.music=true;save();updateMusicButtons();toast(isEnglishLevel(state.level)?'Music on':'Музыка включена')}catch(e){state.music=false;save();updateMusicButtons();toast(isEnglishLevel(state.level)?'Tap the music button again':'Нажмите кнопку музыки ещё раз')}}
function stopMusic(){const a=getAmbient();if(a){a.pause()}state.music=false;save();updateMusicButtons();toast(isEnglishLevel(state.level)?'Music off':'Музыка выключена')}
function toggleMusic(force=false){const a=getAmbient();if(force){if(!state.music||!a||a.paused)startMusic();return}state.music?stopMusic():startMusic()}
function clickSfx(f=620,a=.02,d=.06){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!sfxCtx)sfxCtx=new A();if(sfxCtx.state==='suspended')sfxCtx.resume();const o=sfxCtx.createOscillator(),g=sfxCtx.createGain(),n=sfxCtx.currentTime;o.type='triangle';o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(Math.max(120,f*.72),n+d);g.gain.setValueAtTime(a,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(sfxCtx.destination);o.start(n);o.stop(n+d+.01)}catch(e){}}
if(state.music){state.music=false;save()}if(state.level){applyLanguage();renderProtagonist()}updateMusicButtons();

/* ===== V12 robustness patch ===== */
(function(){
  function safe(fn){try{fn()}catch(e){console.warn('Evervale v12:',e)}}
  window.EVERVALE_BUILD='v12-long-campaign';
  window.addEventListener('DOMContentLoaded', function(){
    safe(function(){
      var f=document.getElementById('chooseFemale');
      var m=document.getElementById('chooseMale');
      if(f){f.setAttribute('type','button'); f.style.pointerEvents='auto'; f.onclick=function(ev){ev.preventDefault(); selectCharacter('female'); return false;};}
      if(m){m.setAttribute('type','button'); m.style.pointerEvents='auto'; m.onclick=function(ev){ev.preventDefault(); selectCharacter('male'); return false;};}
      document.querySelectorAll('.protagonist-card *').forEach(function(x){x.style.pointerEvents='none';});
    });
    safe(function(){
      if(typeof applyLanguage==='function' && window.state && state.level){applyLanguage();}
      if(typeof renderProtagonist==='function' && window.state && state.protagonist){renderProtagonist();}
    });
  });
  var oldToggle = window.toggleMusic;
  window.toggleMusic = function(forceOn){
    try{
      if(typeof oldToggle === 'function') return oldToggle(forceOn);
    }catch(e){console.warn(e)}
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!window.__evervaleAudio && AC){
        var ctx=new AC(), g=ctx.createGain(); g.gain.value=.045; g.connect(ctx.destination);
        [110,165,220].forEach(function(freq,i){
          var o=ctx.createOscillator(); var og=ctx.createGain(); o.type=i===1?'triangle':'sine'; o.frequency.value=freq; og.gain.value=i===0?.5:.25; o.connect(og); og.connect(g); o.start();
        });
        window.__evervaleAudio=ctx;
      } else if(window.__evervaleAudio){
        window.__evervaleAudio.close(); window.__evervaleAudio=null;
      }
    }catch(e){}
  };
})();


/* ===== V13 language and roster patch ===== */
(function(){
  window.EVERVALE_BUILD='v13-expanded-language-and-cast';
  const levelProfiles={A0:{base:'A1',ratio:20,label:'A0 · Starter'},A1:{base:'A1',ratio:35,label:'A1 · Beginner'},A2:{base:'A2',ratio:50,label:'A2 · Elementary'},B1:{base:'B1',ratio:70,label:'B1 · Story Mode'},B2:{base:'B1',ratio:85,label:'B2 · Investigator'},C1:{base:'B1',ratio:100,label:'C1 · Full Immersion'}};
  window.evervaleLevelProfiles=levelProfiles;
  const oldSelectLevel=window.selectLevel;
  window.selectLevel=function(level){
    const chosen=levelProfiles[level]?level:'A1';
    try{
      if(typeof oldSelectLevel==='function'){ oldSelectLevel(chosen); }
      if(window.state) state.level=chosen;
      if(typeof save==='function') save();
      if(typeof applyLanguage==='function') applyLanguage();
      if(typeof renderProtagonist==='function') renderProtagonist();
    }catch(e){
      console.warn('selectLevel patch',e);
      try{ if(window.state) state.level=chosen; if(typeof go==='function') go('character'); }catch(_){}
    }
  };
  const oldApplyLanguage=window.applyLanguage;
  window.applyLanguage=function(){
    const original=(window.state&&state.level)||'A1';
    const profile=levelProfiles[original]||levelProfiles.A1;
    try{
      if(window.state&&(original==='A0'||original==='B2'||original==='C1')){
        state.level=profile.base;
        if(typeof oldApplyLanguage==='function') oldApplyLanguage();
        state.level=original;
      }else if(typeof oldApplyLanguage==='function'){oldApplyLanguage();}
    }catch(e){try{if(window.state)state.level=original}catch(_){}}
    try{
      const indicator=document.getElementById('levelIndicator');
      if(indicator){indicator.textContent='ENGLISH MODE · '+profile.label+' · '+profile.ratio+'% EN';indicator.classList.add('hidden');}
      document.documentElement.setAttribute('data-english-level',original);
      if(original==='B2'||original==='C1'){
        document.querySelectorAll('.speech-translation,.translation,.hint-box').forEach(el=>el.classList.add('hidden'));
      }
      if(original==='C1'){
        document.documentElement.lang='en';
        document.querySelectorAll('[id*="HintBtn"],[id*="Translate"],.translate-btn').forEach(el=>el.classList.add('hidden'));
      }
    }catch(e){}
  };
  window.getEnglishRatio=function(){const p=levelProfiles[(window.state&&state.level)||'A1']||levelProfiles.A1;return p.ratio;};
  window.addEventListener('DOMContentLoaded',()=>{try{document.querySelectorAll('.level-card').forEach(card=>card.setAttribute('type','button'));if(window.state&&state.level&&typeof applyLanguage==='function')applyLanguage();}catch(e){}});
})();


/* ===== V14 clean-click mechanics patch ===== */
(function(){
  window.EVERVALE_BUILD='v14-clean-mechanics';

  function safe(fn){try{return fn()}catch(e){console.warn('Evervale v14:',e)}}

  function makeClickable(selector, handler){
    document.querySelectorAll(selector).forEach(function(el){
      el.style.pointerEvents='auto';
      el.style.position='relative';
      el.style.zIndex='20';
      el.setAttribute('type','button');
      el.addEventListener('click', function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        handler(el, ev);
        return false;
      }, true);
    });
  }

  window.addEventListener('DOMContentLoaded', function(){
    safe(function(){
      document.querySelectorAll('.hero-bg,.scene-art,.scene-overlay,.panel:before').forEach(function(el){
        el.style.pointerEvents='none';
      });
      document.querySelectorAll('.level-card *,.protagonist-card *,.choice *,.verdict *').forEach(function(el){
        el.style.pointerEvents='none';
      });
    });

    safe(function(){
      makeClickable('.level-card', function(el){
        var call = el.getAttribute('onclick') || '';
        var m = call.match(/selectLevel\('([^']+)'\)/);
        if(m && typeof window.selectLevel === 'function') window.selectLevel(m[1]);
      });

      var f=document.getElementById('chooseFemale');
      var m=document.getElementById('chooseMale');
      if(f){
        f.onclick=null;
        f.addEventListener('click', function(ev){
          ev.preventDefault(); ev.stopPropagation();
          if(typeof window.selectCharacter==='function') window.selectCharacter('female');
          return false;
        }, true);
      }
      if(m){
        m.onclick=null;
        m.addEventListener('click', function(ev){
          ev.preventDefault(); ev.stopPropagation();
          if(typeof window.selectCharacter==='function') window.selectCharacter('male');
          return false;
        }, true);
      }
    });

    safe(function(){
      document.querySelectorAll('.btn,.icon-btn,.choice,.verdict,.word,.hotspot').forEach(function(el){
        el.style.pointerEvents='auto';
        el.style.zIndex='20';
      });
    });
  });

  var oldGo = window.go;
  window.go = function(id){
    safe(function(){
      document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
      var target=document.getElementById(id);
      if(target){
        target.classList.add('active');
        target.scrollTop=0;
      }
    });
    if(typeof oldGo === 'function'){
      try{return oldGo(id)}catch(e){console.warn(e)}
    }
  };

  var oldToggleMusic = window.toggleMusic;
  window.toggleMusic = function(forceOn){
    try{
      if(typeof oldToggleMusic === 'function') return oldToggleMusic(forceOn);
    }catch(e){console.warn(e)}
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return;
      if(!window.__evervaleCleanAudio){
        var ctx=new AC();
        var gain=ctx.createGain();
        gain.gain.value=.035;
        gain.connect(ctx.destination);
        [110,165,220].forEach(function(freq,i){
          var osc=ctx.createOscillator();
          var g=ctx.createGain();
          osc.type=i===1?'triangle':'sine';
          osc.frequency.value=freq;
          g.gain.value=i===0?.55:.28;
          osc.connect(g); g.connect(gain); osc.start();
        });
        window.__evervaleCleanAudio=ctx;
      }else{
        window.__evervaleCleanAudio.close();
        window.__evervaleCleanAudio=null;
      }
    }catch(e){}
  };
})();


(function(){
  const oldApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(){
    if(typeof oldApplyLanguage === 'function') oldApplyLanguage();
    try{
      const english = isEnglishLevel(window.state && state.level);
      if(english){
        const txt = {
          chooseFemale:'Female protagonist',
          chooseMale:'Male protagonist'
        };
        const cf=document.getElementById('chooseFemale');
        const cm=document.getElementById('chooseMale');
        if(cf){ const badge=cf.querySelector('.protagonist-badge'); if(badge) badge.textContent='Female protagonist'; }
        if(cm){ const badge=cm.querySelector('.protagonist-badge'); if(badge) badge.textContent='Male protagonist'; }
        document.documentElement.lang='en';
      }
      const ai=document.getElementById('audioIndicator'); if(ai) ai.style.display='none';
      const li=document.getElementById('levelIndicator'); if(li) li.style.display='none';
    }catch(e){console.warn('V15 applyLanguage patch',e)}
  };
})();


/* ===== V17 stable restore / safe English-level patch ===== */
(function(){
  window.EVERVALE_BUILD = 'v17-stable-visuals-c1';

  function levelProfile(level){
    return ({A0:'A1', A1:'A1', A2:'A2', B1:'B1', B2:'B1', C1:'B1'})[level] || 'A1';
  }
  window.levelProfile = levelProfile;

  function updateSelectionScreens(){
    try{
      const lvl = (window.state && state.level) || 'A1';
      const english = ['B1','B2','C1'].includes(lvl);

      // Level screen
      const levelKicker = document.querySelector('#level .kicker');
      const levelTitle = document.querySelector('#level .level-title');
      const langPanel = document.querySelector('#level .language-scale-panel');

      if(levelKicker) levelKicker.textContent = 'Choose your English mode';
      if(levelTitle) levelTitle.textContent = english ? 'Choose your English level' : 'Выберите уровень английского';
      if(langPanel){
        if(english){
          langPanel.innerHTML = `
            The game now includes a wider scale of language modes, from guided entry to full English immersion.
            The higher the level, the more English appears in the interface, dialogue, clues, feedback, and endings.
            <div class="lang-chip-row">
              <span class="lang-chip">A0 — guided start</span>
              <span class="lang-chip">A1 — with translation</span>
              <span class="lang-chip">A2 — translation on demand</span>
              <span class="lang-chip">B1 — English first</span>
              <span class="lang-chip">B2 — almost fully English</span>
              <span class="lang-chip">C1 — full immersion</span>
            </div>`;
        } else {
          langPanel.innerHTML = `
            Теперь уровней больше: от почти полного русского сопровождения до полного погружения на английском.
            Чем выше уровень, тем больше английского в интерфейсе, диалогах, подсказках, уликах и финальных решениях.
            <div class="lang-chip-row">
              <span class="lang-chip">A0 — мягкий вход</span><span class="lang-chip">A1 — с переводом</span><span class="lang-chip">A2 — перевод по кнопке</span><span class="lang-chip">B1 — English first</span><span class="lang-chip">B2 — почти без русского</span><span class="lang-chip">C1 — full immersion</span>
            </div>`;
        }
      }

      // Character screen
      const chKicker = document.querySelector('#character .kicker');
      const chTitle = document.querySelector('#character .level-title');
      const chIntro = document.querySelector('#character .character-intro');
      const chNote = document.querySelector('#character .protagonist-note');
      const backBtn = document.querySelector('#character .btn-row .btn.secondary');
      const female = document.getElementById('chooseFemale');
      const male = document.getElementById('chooseMale');

      if(chKicker) chKicker.textContent = 'Choose your protagonist';
      if(english){
        if(chTitle) chTitle.textContent = 'Choose the main character';
        if(chIntro) chIntro.textContent = 'You can now experience the story as a woman or a man. The central plot remains the same, but the protagonist’s visual identity and tone change. Click a character card to choose your route.';
        if(chNote) chNote.textContent = 'This choice mainly changes the visual identity and tone of the protagonist. Language levels, English progression, and core story tasks remain available.';
        if(backBtn) backBtn.textContent = 'Back';

        if(female){
          const h = female.querySelector('h3');
          const p = female.querySelector('p');
          if(h) h.textContent = 'Elara Vane route';
          if(p) p.textContent = 'An archivist-investigator with sharp intuition and dangerously incomplete memories. Best suited to a more intellectual, atmospheric, and mystical version of the story.';
        }
        if(male){
          const h = male.querySelector('h3');
          const p = male.querySelector('p');
          if(h) h.textContent = 'Arden Vane route';
          if(p) p.textContent = 'A harder, darker version of the protagonist. Best suited to a gothic-noir tone and a more tense investigative route.';
        }
      } else {
        if(chTitle) chTitle.textContent = 'Выберите главного персонажа';
        if(chIntro) chIntro.textContent = 'Теперь вы можете проходить историю за женщину или мужчину. Сюжет остаётся единым, но визуальный образ героя меняется. Нажмите на карточку персонажа, чтобы выбрать главную роль.';
        if(chNote) chNote.textContent = 'Выбор влияет прежде всего на визуальный стиль и подачу героя. Язык, уровни английского и сюжетные задания сохраняются.';
        if(backBtn) backBtn.textContent = 'Назад';

        if(female){
          const h = female.querySelector('h3');
          const p = female.querySelector('p');
          if(h) h.textContent = 'Elara Vane route';
          if(p) p.textContent = 'Архивист-исследователь с тонкой интуицией и опасно неполной памятью. Подходит для более интеллектуальной и мистической версии истории.';
        }
        if(male){
          const h = male.querySelector('h3');
          const p = male.querySelector('p');
          if(h) h.textContent = 'Arden Vane route';
          if(p) p.textContent = 'Более жёсткий и мрачный вариант главного героя. Подходит для gothic-noir подачи и напряжённого расследования.';
        }
      }
    }catch(e){ console.warn('V17 selection screen patch', e); }
  }

  // C1/B2 should use B1 interface pack instead of falling back to A1.
  window.t = function(){
    return UI[levelProfile(state.level)] || UI.A1;
  };

  // C1/B2 should also use the English verdict set.
  window.renderVerdict = function(){
    document.getElementById('trustFinal').textContent = state.trust;
    document.getElementById('evidenceFinal').textContent = (state.level==='A1'||state.level==='A0') ? 'Материалы дела 52/52' : 'Case materials 52/52';
    const box = document.getElementById('verdictChoices');
    box.innerHTML = '';
    const set = verdicts[levelProfile(state.level)] || verdicts.B1;
    set.forEach(v => {
      box.innerHTML += `<button class="verdict" onclick="finish('${v[3]}')"><div class="tag">${v[0]}</div><h3>${v[1]}</h3><p>${v[2]}</p></button>`;
    });
  };

  const oldApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(){
    if(typeof oldApplyLanguage === 'function') oldApplyLanguage();
    updateSelectionScreens();
  };

  const oldSelectLevel = window.selectLevel;
  window.selectLevel = function(level){
    if(typeof oldSelectLevel === 'function') oldSelectLevel(level);
    setTimeout(updateSelectionScreens, 0);
  };

  const oldGo = window.go;
  window.go = function(id){
    const result = (typeof oldGo === 'function') ? oldGo(id) : undefined;
    setTimeout(updateSelectionScreens, 0);
    return result;
  };

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(updateSelectionScreens, 0);
  });
})();


;

(function(){
  const fullEnglish = level => ['B1','B2','C1'].includes(level);
  const beginner = level => level === 'A1' || level === 'A0';
  const bridge = level => level === 'A2';

  window.updateMusicButtons = function(){
    const on = !!state.music;
    const ru = !fullEnglish(state.level);
    const label = ru ? (on ? '♫ Музыка: вкл' : '♫ Музыка: выкл') : (on ? '♫ Music: on' : '♫ Music: off');
    ['musicBtnStart','musicBtn1','musicBtn2','musicBtn3','musicBtn4','musicBtnCampaign','musicBtnAnalysis','musicBtnStudy','musicBtnCaretaker','musicBtnTrace'].forEach(id=>{
      const e=document.getElementById(id); if(e) e.textContent = label;
    });
    const ind=document.getElementById('audioIndicator');
    if(ind) ind.textContent = ru ? (on ? '♫ Музыка включена' : '♫ Музыка выключена') : (on ? '♫ Music on' : '♫ Music off');
  };

  window.renderAnalysisBoard = function(){
    const q = analysisQuestions[state.analysisStep];
    if(!q){ go('hiddenstudy'); return; }
    const a1 = beginner(state.level), a2 = bridge(state.level), en = fullEnglish(state.level);
    document.getElementById('analysisScore').textContent = state.analysisScore + '/4';
    document.getElementById('analysisStability').textContent = state.stability;
    document.getElementById('analysisProgress').textContent = (state.analysisStep+1) + ' / ' + analysisQuestions.length;
    document.getElementById('analysisTitle').textContent = en ? 'Build the Timeline' : 'Постройте временную линию';
    document.getElementById('analysisIntro').textContent = en
      ? 'Connect the physical evidence before entering the victim’s memory. A wrong conclusion may make the later reconstruction less stable.'
      : 'Свяжите вещественные улики до погружения в память погибшей. Ошибочный вывод сделает последующую реконструкцию менее стабильной.';
    document.getElementById('analysisQuestion').textContent = en || a2 ? q.q : q.qRu;
    document.getElementById('analysisContext').textContent = en || a2 ? q.context : q.contextRu;
    const tr = document.getElementById('analysisTranslation');
    tr.textContent = q.qRu + '\n' + q.contextRu;
    tr.classList.toggle('hidden', !a1);
    const tools = document.getElementById('analysisTools');
    tools.innerHTML = '';
    if(a2) tools.innerHTML = '<button class="tool-btn" onclick="toggleBox(\'analysisTranslation\')">Show translation</button>';
    const box = document.getElementById('analysisOptions');
    box.innerHTML = '';
    q.options.forEach(o=>{
      const btn = document.createElement('button');
      btn.className = 'analysis-option';
      btn.innerHTML = o[0] + (a1 ? '<span class="ru">' + o[1] + '</span>' : '');
      btn.onclick = ()=>answerAnalysis(o[2], q.feedback);
      box.appendChild(btn);
    });
    updateMusicButtons();
  };

  window.renderCaretaker = function(){
    if(state.caretakerStep >= caretakerDialogue.length){ save(); go('longcase'); return; }
    const q = caretakerDialogue[state.caretakerStep], a1 = beginner(state.level), a2 = bridge(state.level), en = fullEnglish(state.level);
    document.getElementById('caretakerTrustStat').textContent = state.caretakerTrust;
    document.getElementById('caretakerInfluence').textContent = state.influence;
    document.getElementById('caretakerProgress').textContent = (en ? 'Question ' : 'Вопрос ') + (state.caretakerStep+1) + ' / ' + caretakerDialogue.length;
    document.getElementById('caretakerRole').textContent = en ? 'Caretaker of the Upper District residence' : 'Смотрительница дома в Верхнем квартале';
    document.getElementById('caretakerContext').textContent = en || a2 ? q.context : q.contextRu;
    document.getElementById('caretakerSpeech').textContent = '“' + q.speech + '”';
    const tr = document.getElementById('caretakerTranslation');
    tr.textContent = q.ru;
    tr.classList.toggle('hidden', !a1);
    const vocab = document.getElementById('caretakerVocab');
    vocab.innerHTML = q.vocab.map(v => '<span>' + v + '</span>').join('');
    vocab.classList.toggle('hidden', !a1);
    const tools = document.getElementById('caretakerTools');
    tools.innerHTML = '';
    if(a2) tools.innerHTML = '<button class="tool-btn" onclick="toggleBox(\'caretakerTranslation\')">Show translation</button><button class="tool-btn" onclick="toggleBox(\'caretakerVocab\')">Vocabulary</button>';
    const choices = document.getElementById('caretakerChoices');
    choices.innerHTML = '';
    q.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.innerHTML = '<small>' + c.tone + '</small>' + c.en + (a1 ? '<span class="ru">' + c.ru + '</span>' : '');
      btn.onclick = ()=>answerCaretaker(c);
      choices.appendChild(btn);
    });
    updateMusicButtons();
  };

  window.renderHiddenStudy = function(){
    const a1 = beginner(state.level), a2 = bridge(state.level), en = fullEnglish(state.level);
    document.getElementById('hiddenEvidenceLabel').textContent = en ? 'Hidden clues' : 'Скрытые улики';
    document.getElementById('hiddenEvidenceStat').textContent = state.hiddenFound.length + '/4';
    document.getElementById('hiddenStability').textContent = state.stability;
    document.getElementById('studyTitle').textContent = en ? 'The Room Behind the Wall' : 'Комната за стеной';
    document.getElementById('studyIntro').textContent = en
      ? 'Your deductions activate a concealed mechanism in the mirror frame. A second room opens behind the apartment wall.'
      : 'Ваши выводы активируют скрытый механизм в раме зеркала. За стеной квартиры открывается вторая комната.';
    document.getElementById('studyDescription').textContent = en || a2
      ? 'The annex contains objects collected across several versions of the same crime scene. Dust lies everywhere except on the chair facing the mirror.'
      : 'В тайной комнате хранятся предметы из нескольких версий одного места преступления. Пыль лежит везде, кроме стула напротив зеркала.';
    document.getElementById('studyMaterials').textContent = en ? 'Recovered material' : 'Найденные материалы';
    document.getElementById('studyLead').textContent = en || a2
      ? 'Find four objects that explain why Apartment 17 appears in several buildings.'
      : 'Найдите четыре предмета, объясняющих, почему квартира №17 отмечена в нескольких зданиях.';
    document.getElementById('studyProgress').textContent = en ? 'Find four hidden clues' : 'Найдите четыре скрытые улики';
    document.getElementById('caretakerBtn').textContent = en ? 'Question the caretaker' : 'Допросить смотрительницу';
    document.getElementById('caretakerBtn').disabled = state.hiddenFound.length < 4;
    const box = document.getElementById('hiddenEvidenceList');
    box.innerHTML = '';
    hiddenClues.forEach((c,i)=>{
      const found = state.hiddenFound.includes(i+1);
      let extra = '';
      if(a1) extra = '<small class="translation">' + c.ru + '</small><small>' + c.words + '</small>';
      else if(a2) extra = '<small class="translation hidden" id="hiddenRu' + i + '">' + c.ru + '</small>';
      box.innerHTML += '<div class="study-clue ' + (found ? '' : 'locked') + '"><div class="sig">0' + (i+1) + '</div><div><b>' + c.en + '</b><small>' + c.desc + '</small>' + extra + '</div></div>';
    });
    const tools = document.getElementById('studyTools');
    tools.innerHTML = '';
    if(a2) tools.innerHTML = '<button class="tool-btn" onclick="toggleHiddenTranslations()">Show / hide translations</button>';
    const hint = document.getElementById('studyHint');
    if(a1){
      hint.textContent = 'Подсказка: осмотрите полку слева, верхнюю часть стены, стол и область возле стула.';
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
    for(let i=1;i<=4;i++){
      const h = document.getElementById('sh'+i);
      if(h){
        const f = state.hiddenFound.includes(i);
        h.classList.toggle('found', f);
        h.textContent = f ? '✓' : ['I','II','III','IV'][i-1];
      }
    }
    updateMusicButtons();
  };

  const oldApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(){
    if(typeof oldApplyLanguage === 'function') oldApplyLanguage();
    // Ensure the refreshed screen receives the fixed renderer immediately.
    setTimeout(function(){
      const active = document.querySelector('.screen.active');
      if(!active) return;
      if(active.id === 'analysisboard') renderAnalysisBoard();
      if(active.id === 'caretaker') renderCaretaker();
      if(active.id === 'hiddenstudy') renderHiddenStudy();
      updateMusicButtons();
    }, 0);
  };

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){
      const active = document.querySelector('.screen.active');
      if(active){
        if(active.id === 'analysisboard') renderAnalysisBoard();
        if(active.id === 'caretaker') renderCaretaker();
        if(active.id === 'hiddenstudy') renderHiddenStudy();
      }
      updateMusicButtons();
    }, 0);
  });
})();

;

document.addEventListener('DOMContentLoaded', function(){
  var map = {
    'Irene Vale':'irene','Silas Vane':'silas','Lady Morwen':'morwen','Oren Thale':'oren',
    'Kael Dusk':'kael','The Nameless Queen':'queen','Mara Holt':'mara','Felix Marr':'felix',
    'Vesper Reed':'vesper','Nell Ash':'nell','Rowan Vale':'rowan','Archivist Null':'null'
  };
  document.querySelectorAll('.roster-card h3').forEach(function(h){
    var card = h.closest('.roster-card');
    if(card && map[h.textContent.trim()]) card.setAttribute('data-portrait', map[h.textContent.trim()]);
  });
});

;

(function(){
  function polishDynamicLabels(){
    try{
      var isEN = ['B1','B2','C1'].includes((window.state && state.level) || 'A1');
      document.querySelectorAll('.inline-profile small').forEach(function(el){ el.textContent = isEN ? 'Main character' : 'Главный герой'; });
      var startBtn = document.getElementById('musicBtnStart');
      if(startBtn && isEN && startBtn.textContent.includes('Музыка')) startBtn.textContent = startBtn.textContent.replace('Музыка','Music').replace('вкл','on').replace('выкл','off');
      if(startBtn && !isEN && startBtn.textContent.includes('Music')) startBtn.textContent = startBtn.textContent.replace('Music','Музыка').replace('on','вкл').replace('off','выкл');
    } catch(e){}
  }
  var oldGo = window.go;
  window.go = function(id){ var r = oldGo ? oldGo(id) : undefined; setTimeout(polishDynamicLabels,0); return r; };
  var oldApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(){ if(oldApplyLanguage) oldApplyLanguage(); setTimeout(polishDynamicLabels,0); };
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(polishDynamicLabels,0); });
})();

;

(function(){
  const previousGo = window.go;
  window.go = function(id){
    let result;
    if(typeof previousGo === 'function'){
      result = previousGo(id);
    }
    try{
      document.querySelectorAll('.screen').forEach(function(s){
        if(s.classList.contains('active')){
          s.classList.add('active');
          s.style.display = '';
          s.style.visibility = 'visible';
          s.scrollTop = 0;
        }else{
          s.classList.remove('active');
          s.style.display = 'none';
          s.style.visibility = 'hidden';
        }
      });
      window.scrollTo(0,0);
    }catch(e){}
    setTimeout(function(){
      try{
        const target = document.getElementById(id);
        if(target) target.scrollTop = 0;
      }catch(e){}
    },0);
    return result;
  };

  document.addEventListener('DOMContentLoaded', function(){
    try{
      const active = document.querySelector('.screen.active') || document.getElementById('start');
      document.querySelectorAll('.screen').forEach(function(s){
        if(s === active){
          s.classList.add('active');
          s.style.display = '';
          s.style.visibility = 'visible';
        }else{
          s.classList.remove('active');
          s.style.display = 'none';
          s.style.visibility = 'hidden';
        }
      });
    }catch(e){}
  });
})();
