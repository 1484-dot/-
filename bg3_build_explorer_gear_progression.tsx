import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Search, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Filter, 
  Sparkles, 
  Flame, 
  Zap, 
  Crosshair, 
  Award, 
  Lock, 
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Swords,
  Info,
  Star,
  Users,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

// ==========================================
// 1. REGIONS DATA (ACT 1, 2, 3)
// ==========================================
const ACT_REGIONS = [
  {
    act: 1,
    actTitle: "第一幕 (Act 1)",
    regions: [
      { id: "act1_emerald_grove", name: "翠绿林地", sub: "Emerald Grove" },
      { id: "act1_blighted_village", name: "染疫村庄", sub: "Blighted Village" },
      { id: "act1_sunlit_wetlands", name: "太阳湿地/沼泽", sub: "Sunlit Wetlands" },
      { id: "act1_goblin_camp", name: "地精营地", sub: "Goblin Camp" },
      { id: "act1_underdark", name: "幽暗地域", sub: "Underdark" },
      { id: "act1_grymforge", name: "复仇之炉", sub: "Grymforge" },
      { id: "act1_mountain_pass", name: "瑰晨修道院与养育间", sub: "Rosymorn / Mountain Pass" },
    ]
  },
  {
    act: 2,
    actTitle: "第二幕 (Act 2)",
    regions: [
      { id: "act2_last_light_inn", name: "终焉之光旅店", sub: "Last Light Inn" },
      { id: "act2_shadow_lands", name: "诅咒之地", sub: "Shadow-Cursed Lands" },
      { id: "act2_moonrise_towers", name: "月出之塔", sub: "Moonrise Towers" },
      { id: "act2_gauntlet_shar", name: "莎尔试炼场", sub: "Gauntlet of Shar" },
    ]
  },
  {
    act: 3,
    actTitle: "第三幕 (Act 3)",
    regions: [
      { id: "act3_rivington", name: "利文顿", sub: "Rivington" },
      { id: "act3_lower_city", name: "博德之门下城区", sub: "Lower City" },
      { id: "act3_house_of_hope", name: "希望之邸", sub: "House of Hope" },
      { id: "act3_sewers", name: "下水道与地下城", sub: "Sewers & Undercity" },
      { id: "act3_house_of_grief", name: "哀伤之邸", sub: "House of Grief" },
    ]
  }
];

const MAIN_CLASSES = [
  "全部职业", "野蛮人", "吟游诗人", "牧师", "德鲁伊", 
  "战士", "武僧", "圣骑士", "游侠", "游荡者", 
  "术士", "邪术师", "法师"
];

const ROLES_LIST = [
  "全部定位", "单体爆发", "群体AOE", "控场大师", 
  "团队辅助", "前排坦克", "召唤军团", "潜行暗杀"
];

const TIERS_LIST = ["全部 Tier", "T0", "T1", "T2", "T3"];

// Slot info & layout icons
const SLOT_INFO = {
  head: { name: "头部", icon: "👑" },
  cloak: { name: "披风", icon: "🧥" },
  armor: { name: "胸甲", icon: "🛡️" },
  gloves: { name: "手套", icon: "🥊" },
  boots: { name: "鞋子", icon: "🥾" },
  amulet: { name: "项链", icon: "📿" },
  ring1: { name: "戒指 1", icon: "💍" },
  ring2: { name: "戒指 2", icon: "💍" },
  mainHand: { name: "主手武器", icon: "⚔️" },
  offHand: { name: "副手/盾牌", icon: "🛡️" },
  ranged: { name: "远程武器", icon: "🏹" }
};

// ==========================================
// 2. FULL 46 SUBCLASS BUILDS DATA
// ==========================================
const BUILDS_DATA = [
  // ---------------- 野蛮人 (3) ----------------
  {
    id: "barb_berserker",
    name: "酒馆狂暴投掷蛮",
    mainClass: "野蛮人",
    subclass: "狂战士",
    tier: "T0",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "🪓",
    summary: "依托酒馆殴斗者特长与狂战士附赠动作狂怒投掷，实现远距离高频击倒与碾压打击。",
    multiclass: "5狂战士 / 4盗贼 / 3冠军勇士",
    attributes: { STR: "17", DEX: "14", CON: "16", INT: "8", WIS: "10", CHA: "8" },
    feats: ["酒馆殴斗者 (Tavern Brawler)", "警觉 (Alert)"],
    strategy: [
      "开局开启狂暴，附赠动作使用狂怒投掷强制击倒关键敌方目标。",
      "对倒地目标使用投掷武器（尼鲁纳/回归长矛）触发优势暴击碾压。"
    ],
    equipment: {
      head: { name: "Horns of the Berserker", displayName: "狂战士之角", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 恶魔的小品店" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿 - 丹瑟隆的灵丹妙药店" },
      armor: { name: "Bonespike Garb", displayName: "骨刺胸甲", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 埃克萨尔托雷" },
      gloves: { name: "Gloves of Uninhibited Kushigo", displayName: "无拘库席哥手套", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域 - 寻找蕈人采菇人任务", isCore: true },
      boots: { name: "Bonespike Boots", displayName: "骨刺靴", rarity: "veryRare", regionId: "act3_sewers", location: "下水道 - 抓获路途宝箱" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 击败卡哈" },
      ring1: { name: "Ring of Flinging", displayName: "投掷戒指", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 提夫林商人亚伦", isCore: true },
      ring2: { name: "Caustic Band", displayName: "腐蚀之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域 - 蕈人村德里丝" },
      mainHand: { name: "Nyrulna", displayName: "尼鲁纳", rarity: "legendary", regionId: "act3_rivington", location: "利文顿 - 马戏团转盘大奖得主掉落", isCore: true },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店 - 商人" },
      ranged: { name: "Returning Pike", displayName: "回归长矛", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 地精商人格拉布" }
    }
  },
  {
    id: "barb_wildheart",
    name: "麋鹿踩踏冲击蛮",
    mainClass: "野蛮人",
    subclass: "荒野之心",
    tier: "T1",
    role: "前排坦克",
    difficulty: "入门简单",
    icon: "🦌",
    summary: "选择麋鹿之心心脏图腾，利用冲锋踩踏大范围敌人造成击倒与机动粉碎效果。",
    multiclass: "8荒野之心 / 4冠军勇士",
    attributes: { STR: "17", DEX: "14", CON: "16", INT: "8", WIS: "10", CHA: "8" },
    feats: ["巨武器大师 (Great Weapon Master)", "警觉 (Alert)"],
    strategy: [
      "开启麋鹿狂暴，使用‘麋鹿冲锋’穿过敌群制造大规模群体击倒。",
      "搭配巨武器大师近战横扫被击倒的目标打出高额伤害。"
    ],
    equipment: {
      head: { name: "Helm of Balduran", displayName: "博德安的头盔", rarity: "legendary", regionId: "act3_lower_city", location: "下城区 - 龙安要塞地下巨龙遗迹" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿 - 丹瑟隆灵药店" },
      armor: { name: "Enraging Heart Garb", displayName: "激怒之心胸甲", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 罗阿·月光", isCore: true },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸 - 档案馆" },
      boots: { name: "Linebreaker Boots", displayName: "破阵者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 碎岩者掉落", isCore: true },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸 - 档案馆" },
      ring1: { name: "Ring of Absolute Force", displayName: "绝对者之力戒指", rarity: "uncommon", regionId: "act1_grymforge", location: "复仇之炉 - 极品中队宝箱" },
      ring2: { name: "Crusher's Ring", displayName: "粉碎机之戒", rarity: "rare", regionId: "act1_goblin_camp", location: "地精营地 - 粉碎机" },
      mainHand: { name: "Corpsegrinder", displayName: "绞肉机粉碎锤", rarity: "rare", regionId: "act3_lower_city", location: "下城区 - 里文顿吉斯洋基伏击者掉落" },
      offHand: { name: "Empty", displayName: "双手武器姿态", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店 - 戴摩" }
    }
  },
  {
    id: "barb_wildmagic",
    name: "狂野魔法充能蛮",
    mainClass: "野蛮人",
    subclass: "狂野魔法",
    tier: "T2",
    role: "团队辅助",
    difficulty: "中等进阶",
    icon: "✨",
    summary: "狂暴时触发随机魔法效果，并能为法系队友恢复1-3环法术位，兼具防御与法力补充。",
    multiclass: "9狂野魔法 / 3冠军勇士",
    attributes: { STR: "16", DEX: "14", CON: "16", INT: "8", WIS: "10", CHA: "10" },
    feats: ["巨武器大师 (GWM)", "属性提升 (+2 STR)"],
    strategy: [
      "狂暴触发狂野魔法湍流为全队提供护甲或伤害光环。",
      "使用‘魔法察觉’与‘法力注入’给队内的核爆法师补满高阶法术位。"
    ],
    equipment: {
      head: { name: "Mask of Soul Perception", displayName: "灵魂察觉面具", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 恶魔的小品店" },
      cloak: { name: "Cavalier Cloak", displayName: "骑士斗篷", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店 - 戴摩" },
      armor: { name: "Adamantine Splint Armor", displayName: "精金重甲", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉 - 精金锻造炉", isCore: true },
      gloves: { name: "Swordmaster Gloves", displayName: "剑术大师手套", rarity: "rare", regionId: "act3_lower_city", location: "下城区 - 铁匠铺" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 明萨拉掉落", isCore: true },
      amulet: { name: "Amulet of Restoration", displayName: "复原护符", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域 - 德里丝" },
      ring1: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地 - 摩尔偷窃神像任务" },
      ring2: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阿蕾洁" },
      mainHand: { name: "The Skinburster", displayName: "破皮者 halberd", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间 - 孵化间宝箱" },
      offHand: { name: "Empty", displayName: "双手武器", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 罗阿·月光" }
    }
  },

  // ---------------- 吟游诗人 (3) ----------------
  {
    id: "bard_swords",
    name: "奥术犀利双弩剑舞诗人",
    mainClass: "吟游诗人",
    subclass: "剑术学派",
    tier: "T0",
    role: "单体爆发",
    difficulty: "中等进阶",
    icon: "🏹",
    summary: "利用远程多重射击快速叠满奥术锐气，随后附赠动作施放100%成功率控制法术。",
    multiclass: "10剑术诗人 / 1战士 / 1法师",
    attributes: { STR: "8", DEX: "16", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["神射手 (Sharpshooter)", "属性提升 (+2 CHA)"],
    strategy: [
      "首轮使用远程诗学攻击（多重射击）连续命中4-8次，快速叠满10层奥术锐气。",
      "通过神秘刺客戒指的附赠动作使用人类定身术或催眠图纹控制全场。"
    ],
    equipment: {
      head: { name: "Helmet of Arcane Acuity", displayName: "奥术锐气头盔", rarity: "uncommon", regionId: "act2_shadow_lands", location: "诅咒之地 - 征税所地下宝箱", isCore: true },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 恶魔的小品店" },
      armor: { name: "Armor of Agility", displayName: "敏捷铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 风暴海岸军械库" },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间 - 军火商阿吉克" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉 - 真魂者讷罗" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸 - 档案馆" },
      ring1: { name: "Band of the Mystic Scoundrel", displayName: "神秘刺客之环", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 马戏团转盘隐秘丛林", isCore: true },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间 - 审判官房间" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间 - 军火商" },
      offHand: { name: "Belm", displayName: "贝姆", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 贾希拉住宅地下室" },
      ranged: { name: "The Dead Shot", displayName: "致命一击长弓", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 菲尔格雷夫陵墓商人" }
    }
  },
  {
    id: "bard_lore",
    name: "全系奥术窃取传说诗人",
    mainClass: "吟游诗人",
    subclass: "传说学派",
    tier: "T1",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "📜",
    summary: "利用魔法秘密窃取各职业顶级法术（如反制法术、饥渴之息、加速术），做极致控场与削弱。",
    multiclass: "10传说诗人 / 2风暴牧师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "12", CHA: "17" },
    feats: ["警觉 (Alert)", "属性提升 (+2 CHA)"],
    strategy: [
      "利用语言砍削（Cutting Words）附赠反应削弱敌人的攻击骰与豁免骰。",
      "配合潜能法袍强化戏法伤害，并用窃取的饥渴之息/反制法术主导战场。"
    ],
    equipment: {
      head: { name: "Birthright", displayName: "诞生之冠 (+2魅力)", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 巫术杂货店罗兰" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 恶魔的小品店" },
      armor: { name: "Potent Robe", displayName: "潜能法袍", rarity: "veryRare", regionId: "act2_last_light_inn", location: "终焉之光旅店 - 拯救提夫林任务", isCore: true },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 小丑连体任务" },
      boots: { name: "Boots of Arcane Bolstering", displayName: "奥术加固之靴", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间 - 孵化间" },
      amulet: { name: "Fey Semblance Amulet", displayName: "妖精幻象护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 鬼婆支持者任务" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室" },
      ring2: { name: "Callous Glow Ring", displayName: "冷酷光芒戒指", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场 - 宝箱" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区 - 巫术杂货店高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔 - 凯瑟里克" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 铁匠铺" }
    }
  },
  {
    id: "bard_valor",
    name: "战斗鼓舞前排勇气诗人",
    mainClass: "吟游诗人",
    subclass: "勇气学派",
    tier: "T2",
    role: "团队辅助",
    difficulty: "入门简单",
    icon: "🥁",
    summary: "装备中甲与盾牌兼顾前排生存，使用战斗鼓舞为全队增加护甲AC与攻击伤害。",
    multiclass: "10勇气诗人 / 2战士",
    attributes: { STR: "16", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "16" },
    feats: ["巨武器大师", "警觉"],
    strategy: [
      "为队伍物理输出角色施加战斗鼓舞（加伤害/护甲AC）。",
      "使用动作如潮发动一回合多重攻击并配合圣光法术控制。"
    ],
    equipment: {
      head: { name: "Cap of Curing", displayName: "治疗帽", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 亚伦附近宝箱" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿 - 商人" },
      armor: { name: "Yuan-Ti Scale Mail", displayName: "源氏鳞甲", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店 - 戴摩", isCore: true },
      gloves: { name: "Wondrous Gloves", displayName: "奇迹手套", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉 - 极品侏儒掉落" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 明萨拉" },
      amulet: { name: "Amulet of Restoration", displayName: "复原护符", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域 - 德里丝" },
      ring1: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地 - 摩尔任务" },
      ring2: { name: "Whispering Promise", displayName: "低语之约", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 沃尔罗出售", isCore: true },
      mainHand: { name: "Phalar Aluve", displayName: "玛拉·阿鲁威 (咆哮剑)", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域 - 石中剑所在地", isCore: true },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 罗阿" }
    }
  },

  // ---------------- 牧师 (7) ----------------
  {
    id: "cleric_life",
    name: "永生急救生命牧师",
    mainClass: "牧师",
    subclass: "生命领域",
    tier: "T1",
    role: "团队辅助",
    difficulty: "入门简单",
    icon: "💖",
    summary: "极致的治疗与保护，通过治疗法术同时触发全队上祝福术、剑刃防护与大量生命回复。",
    multiclass: "12生命牧师",
    attributes: { STR: "14", DEX: "10", CON: "16", INT: "8", WIS: "17", CHA: "10" },
    feats: ["战术精通/专注 (War Caster)", "属性提升 (+2 WIS)"],
    strategy: [
      "施放群体疗伤术，瞬间为全队附加3回合祝福术与减半物理伤害的剑刃防护。",
      "引导神力使用生命保存拯救濒死队友。"
    ],
    equipment: {
      head: { name: "Wapira's Crown", displayName: "瓦皮拉之冠", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 泽夫洛任务奖励" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿 - 丹瑟隆灵药店" },
      armor: { name: "Armor of Devotion", displayName: "虔诚铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 军械库" },
      gloves: { name: "Hellrider's Pride", displayName: "地狱骑士的骄傲", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 泽夫洛", isCore: true },
      boots: { name: "Boots of Aid and Comfort", displayName: "援助与舒适之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 罗阿·月光" },
      amulet: { name: "Amulet of Restoration", displayName: "复原护符", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域 - 德里丝" },
      ring1: { name: "The Whispering Promise", displayName: "低语之约", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 沃尔罗/亚伦", isCore: true },
      ring2: { name: "Ring of Salving", displayName: "救助之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域 - 德里丝" },
      mainHand: { name: "Blood of Lathander", displayName: "洛山达之血", rarity: "legendary", regionId: "act1_mountain_pass", location: "瑰晨修道院 - 密室解谜" },
      offHand: { name: "Viconia's Walking Fortress", displayName: "维康尼亚的行走堡垒", rarity: "legendary", regionId: "act3_house_of_grief", location: "哀伤之邸 - 击败维康尼亚" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 铁匠铺" }
    }
  },
  {
    id: "cleric_light",
    name: "辐射法球核爆光明牧",
    mainClass: "牧师",
    subclass: "光明领域",
    tier: "T0",
    role: "群体AOE",
    difficulty: "入门简单",
    icon: "☀️",
    summary: "利用守卫之形与黎明之光打出超大范围光芒伤害，同时给全场敌人挂满减命中辐射法球。",
    multiclass: "12光明牧师",
    attributes: { STR: "8", DEX: "14", CON: "16", INT: "8", WIS: "17", CHA: "10" },
    feats: ["警觉 (Alert)", "属性提升 (+2 WIS)"],
    strategy: [
      "开启‘守护之魂’并在敌群中穿梭，触发辐射法球装备连锁效果。",
      "引导神力‘黎明之光’瞬间清空大面积不死生物与阴影怪物。"
    ],
    equipment: {
      head: { name: "Holy Lance Helm", displayName: "圣枪头盔", rarity: "rare", regionId: "act1_mountain_pass", location: "修道院屋顶宝箱" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Luminous Armor", displayName: "发光铠甲", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域 - 塞伦涅前哨站隐藏宝箱", isCore: true },
      gloves: { name: "Luminous Gloves", displayName: "发光手套", rarity: "rare", regionId: "act2_shadow_lands", location: "诅咒之地 - 陶艺师工坊宝箱", isCore: true },
      boots: { name: "Boots of Stormy Clamour", displayName: "风暴咆哮之靴", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域 - 奥米伦出售" },
      amulet: { name: "Spine Shudder Amulet", displayName: "脊椎战栗护符", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阻碍者宝箱" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室", isCore: true },
      ring2: { name: "Callous Glow Ring", displayName: "冷酷光芒戒指", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场宝箱" },
      mainHand: { name: "Blood of Lathander", displayName: "洛山达之血", rarity: "legendary", regionId: "act1_mountain_pass", location: "瑰晨修道院" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" }
    }
  },
  {
    id: "cleric_tempest",
    name: "风暴毁灭核爆法牧",
    mainClass: "牧师",
    subclass: "风暴领域",
    tier: "T0",
    role: "群体AOE",
    difficulty: "中等进阶",
    icon: "⚡",
    summary: "利用造水术产生湿润翻倍，配合毁灭怒火跳过伤害骰直接打出最大电击/雷鸣伤害。",
    multiclass: "10风暴术士 / 2风暴牧师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "12", CHA: "17" },
    feats: ["元素专精: 闪电", "属性提升 (+2 CHA)"],
    strategy: [
      "施放造水术使全场目标获得【湿润】（雷/冰伤害翻倍）。",
      "施放连锁闪电/闪电束并触发毁灭怒火，瞬间打出单体数百点的爆发数值。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 菲尔格雷夫墓穴" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 恶魔的小品店" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 巫术杂货店高塔" },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 小丑任务" },
      boots: { name: "Watersparkers", displayName: "水火不侵之靴", rarity: "rare", regionId: "act1_goblin_camp", location: "地精营地 - 明萨拉宝箱" },
      amulet: { name: "Amulet of the Devout", displayName: "虔信者护符 (+2DC与神力)", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 礼拜堂地下宝箱", isCore: true },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室" },
      ring2: { name: "Sparkswall", displayName: "火花壁垒戒指", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域 - 奥克兰高塔宝箱" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区 - 巫术杂货店高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔 - 凯瑟里克" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 铁匠铺" }
    }
  },
  {
    id: "cleric_trickery",
    name: "潜行幻象刺客诡术牧",
    mainClass: "牧师",
    subclass: "诡术领域",
    tier: "T2",
    role: "潜行暗杀",
    difficulty: "高阶流派",
    icon: "🎭",
    summary: "利用分身幻象吸引火力并为队友提供攻击优势，配合隐匿庇护进行致命潜行袭击。",
    multiclass: "9诡术牧师 / 3刺客",
    attributes: { STR: "8", DEX: "16", CON: "14", INT: "8", WIS: "16", CHA: "10" },
    feats: ["警觉 (Alert)", "神射手 (Sharpshooter)"],
    strategy: [
      "召唤‘ Invoke Duplicity（召唤分身）’放置在战场中央提供永久近战优势。",
      "对队伍刺客施加‘诡术祝福’使其潜行检定获得优势轻松进入首轮暴击。"
    ],
    equipment: {
      head: { name: "Covert Cowl", displayName: "隐秘兜帽", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室" },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 盗贼公会" },
      armor: { name: "Armor of Agility", displayName: "敏捷铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 军械库" },
      gloves: { name: "Stalker Gloves", displayName: "追踪者手套", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店", isCore: true },
      amulet: { name: "Surge Amulet", displayName: "涌动护符", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉" },
      ring1: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阿剌吉", isCore: true },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间宝箱" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Titanstring Bow", displayName: "泰坦弦弓", rarity: "rare", regionId: "act1_blighted_village", location: "散塔林会藏身处" }
    }
  },
  {
    id: "cleric_knowledge",
    name: "全能百科知识领域牧",
    mainClass: "牧师",
    subclass: "知识领域",
    tier: "T3",
    role: "团队辅助",
    difficulty: "入门简单",
    icon: "📖",
    summary: "利用时代知识获得任意属性技能熟练度，搭配控制法术成为剧情与通关万能工具人。",
    multiclass: "12知识牧师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "12", WIS: "17", CHA: "10" },
    feats: ["技能大师 (Skill Expert)", "属性提升 (+2 WIS)"],
    strategy: [
      "根据探索场景使用‘时代知识’免费通关所有历史、奥秘、隐匿或说服检定。",
      "战斗中使用奥术控制法术（慢速术、混乱术）掌控局势。"
    ],
    equipment: {
      head: { name: "Warped Headband of Intellect", displayName: "歪曲的智力头带", rarity: "uncommon", regionId: "act1_blighted_village", location: "染疫村庄 - 食人魔三兄弟掉落", isCore: true },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "The Graceful Cloth", displayName: "优雅布衣", rarity: "veryRare", regionId: "act1_mountain_pass", location: "山隘 - 埃斯特女士", isCore: true },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Guidance Amulet", displayName: "引导护符", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地附近骷髅" },
      ring1: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring2: { name: "Mage's Friend", displayName: "法师之友戒指", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域塔楼" },
      mainHand: { name: "Staff of Arcane Blessing", displayName: "奥术祝福法杖", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域 - 奥克兰高塔顶层" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" }
    }
  },
  {
    id: "cleric_nature",
    name: "棘刺地形植物自然牧",
    mainClass: "牧师",
    subclass: "自然领域",
    tier: "T2",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "🌿",
    summary: "掌握植物滋长与棘刺丛生，配合雷鸣波将敌人反复推入绝望的地形地狱中。",
    multiclass: "12自然牧师",
    attributes: { STR: "14", DEX: "10", CON: "16", INT: "8", WIS: "17", CHA: "8" },
    feats: ["战术精通", "属性提升 (+2 WIS)"],
    strategy: [
      "铺设‘植物滋长’使敌人移动力骤减4倍，再重叠施放‘棘刺丛生’。",
      "敌人试图走出区域时使用雷鸣波或拉扯技能将其送回中心。"
    ],
    equipment: {
      head: { name: "Ironvine Helm", displayName: "铁藤头盔", rarity: "rare", regionId: "act2_shadow_lands", location: "诅咒之地 - 泥石镇" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Armor of Land and Sky", displayName: "天地铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      gloves: { name: "Ironvine Gloves", displayName: "铁藤手套", rarity: "rare", regionId: "act2_shadow_lands", location: "诅咒之地", isCore: true },
      boots: { name: "Boots of Genial Striding", displayName: "亲和阔步之靴 (免疫减速地形)", rarity: "uncommon", regionId: "act2_last_light_inn", location: "终焉之光旅店 - 简森", isCore: true },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ring2: { name: "Ring of Plant Growth", displayName: "植物生长戒指", rarity: "rare", regionId: "act3_lower_city", location: "下城区" },
      mainHand: { name: "Cacophony", displayName: "刺耳杂音法杖", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间 - 阿吉克" },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" }
    }
  },
  {
    id: "cleric_war",
    name: "战争神圣附加连击战牧",
    mainClass: "牧师",
    subclass: "战争领域",
    tier: "T1",
    role: "前排坦克",
    difficulty: "入门简单",
    icon: "⚔️",
    summary: "利用战争祭司附赠动作额外攻击，结合+10命中的神圣引导与重甲近战爆发。",
    multiclass: "11战争牧师 / 1圣骑士",
    attributes: { STR: "17", DEX: "10", CON: "14", INT: "8", WIS: "16", CHA: "8" },
    feats: ["巨武器大师", "属性提升 (+2 STR)"],
    strategy: [
      "开启巨武器大师-5命中+10伤害，命中不够时触发神力引导+10必中。",
      "消耗战争祭司次数，在附赠动作额外打出重型武器挥砍。"
    ],
    equipment: {
      head: { name: "Helm of Balduran", displayName: "博德安的头盔", rarity: "legendary", regionId: "act3_lower_city", location: "下城区地下巨龙遗迹" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Reaper's Embrace", displayName: "收割者的拥抱", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔 - 凯瑟里克掉落", isCore: true },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of the Devout", displayName: "虔信者护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区礼拜堂地下" },
      ring1: { name: "Ring of Absolute Force", displayName: "绝对者之力戒指", rarity: "uncommon", regionId: "act1_grymforge", location: "复仇之炉" },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      mainHand: { name: "Balduran's Giantslayer", displayName: "博德安的巨剑", rarity: "legendary", regionId: "act3_lower_city", location: "下城区 - 龙安要塞地下巨龙遗迹", isCore: true },
      offHand: { name: "Empty", displayName: "双手持握", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },

  // ---------------- 德鲁伊 (3) ----------------
  {
    id: "druid_moon",
    name: "枭熊巨兽变形肉盾德",
    mainClass: "德鲁伊",
    subclass: "月亮圈子",
    tier: "T1",
    role: "前排坦克",
    difficulty: "入门简单",
    icon: "🐻",
    summary: "利用附赠动作变身枭熊或水元素双侍，享有独立血条与高额粉碎碰撞伤害。",
    multiclass: "10月亮德鲁伊 / 2战士",
    attributes: { STR: "10", DEX: "14", CON: "16", INT: "8", WIS: "16", CHA: "8" },
    feats: ["酒馆殴斗者 (适用于变身)", "警觉"],
    strategy: [
      "战斗开始附赠动作变为枭熊，使用‘粉碎飞跃’从高处砸下造成巨额范围伤害。",
      "主血条降为零后自动退回本体，本体完好无损可再次变身。"
    ],
    equipment: {
      head: { name: "Shapeshifter's Boon Headband", displayName: "变形者之恩头带", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地 - 牛牛/变异牛" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Armour of Moonbasking", displayName: "沐月铠甲 (变身加临时血量与AC)", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 静谧之屋无名商人", isCore: true },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Shapeshifter's Boon Ring", displayName: "变形者之戒", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地 - 伪装怪掉落", isCore: true },
      ring2: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" }
    }
  },
  {
    id: "druid_land",
    name: "自然元素地形大地德",
    mainClass: "德鲁伊",
    subclass: "大地圈子",
    tier: "T1",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "🌋",
    summary: "掌握冰霜、闪电与泥泞地形法术，利用短休恢复法术位进行大面积控制与伤害。",
    multiclass: "12大地德鲁伊",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "17", CHA: "10" },
    feats: ["战术精通", "属性提升 (+2 WIS)"],
    strategy: [
      "铺设大面积冰霜与泥泞，使敌人频繁滑倒击倒。",
      "通过‘自然恢复’在战斗间隙充能高阶法术位。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Winter's Clutches", displayName: "凛冬之拥", rarity: "uncommon", regionId: "act1_mountain_pass", location: "山隘 - 埃斯特", isCore: true },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足 (免疫滑倒)", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉 - 讷罗", isCore: true },
      amulet: { name: "Amulet of the Devout", displayName: "虔信者护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区礼拜堂" },
      ring1: { name: "Snowburst Ring", displayName: "雪暴戒指", rarity: "uncommon", regionId: "act2_shadow_lands", location: "诅咒之地 - 泥石镇木箱", isCore: true },
      ring2: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室" },
      mainHand: { name: "Mourning Frost", displayName: "哀悼霜雪法杖", rarity: "veryRare", regionId: "act1_underdark", location: "幽暗地域 - 三件碎片合成" },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "druid_spores",
    name: "孢子军团真菌召唤德",
    mainClass: "德鲁伊",
    subclass: "孢子圈子",
    tier: "T1",
    role: "召唤军团",
    difficulty: "中等进阶",
    icon: "🍄",
    summary: "利用共生实体获得大量临时生命与附加坏死伤害，同时复活多具真菌僵尸组成防线。",
    multiclass: "12孢子德鲁伊",
    attributes: { STR: "8", DEX: "14", CON: "16", INT: "8", WIS: "17", CHA: "8" },
    feats: ["战术精通", "属性提升 (+2 WIS)"],
    strategy: [
      "战斗前开启‘共生实体’，获得数十点临时生命与额外坏死伤害。",
      "击杀敌方后使用‘真菌感染’将其转化为真菌僵尸作为肉盾。"
    ],
    equipment: {
      head: { name: "Circle of Bones", displayName: "白骨之冠", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场 - 宝箱" },
      cloak: { name: "Crypt Lord Cloak", displayName: "地穴领主斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 杀死神秘木乃伊" },
      armor: { name: "Armor of the Sporekeeper", displayName: "孢子守护者铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 静谧之屋", isCore: true },
      gloves: { name: "Gloves of Beligerent Skies", displayName: "好战天空手套", rarity: "uncommon", regionId: "act1_mountain_pass", location: "养育间 - 医务室" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Crypt Lord Ring", displayName: "死灵召集戒指", rarity: "rare", regionId: "act3_lower_city", location: "下城区" },
      ring2: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      mainHand: { name: "Staff of Cherished Necromancy", displayName: "珍爱死灵法杖", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 卡里翁掉落", isCore: true },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" }
    }
  },

  // ---------------- 战士 (3) ----------------
  {
    id: "fighter_champion",
    name: "减暴击门槛重击冠军勇士",
    mainClass: "战士",
    subclass: "冠军勇士",
    tier: "T1",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "🗡️",
    summary: "极限堆叠减暴击门槛装备（最低14即暴击），实现绝大多数攻击全为致命一击。",
    multiclass: "11冠军勇士 / 1极速兼职",
    attributes: { STR: "17", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "8" },
    feats: ["巨武器大师", "警觉", "属性提升 (+2 STR)"],
    strategy: [
      "开启动作如潮打出近战6连击，高概率频发致命一击。",
      "触发巨武器大师被动附赠动作额外挥砍。"
    ],
    equipment: {
      head: { name: "Sarevok's Horned Helmet", displayName: "沙洛佛克的角头盔", rarity: "veryRare", regionId: "act3_sewers", location: "下水道 - 巴尔裁判所沙洛佛克掉落", isCore: true },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 盗贼公会", isCore: true },
      armor: { name: "Armor of Persistence", displayName: "永恒执念铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 铁匠铺戴摩" },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阿剌吉" },
      ring2: { name: "Killer's Sweetheart", displayName: "杀手甜心", rarity: "veryRare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场试炼奖励" },
      mainHand: { name: "Balduran's Giantslayer", displayName: "博德安的巨剑", rarity: "legendary", regionId: "act3_lower_city", location: "下城区 - 龙安要塞地下巨龙遗迹", isCore: true },
      offHand: { name: "Empty", displayName: "双手武器姿态", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "The Dead Shot", displayName: "致命一击长弓 (降低暴击门槛)", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" }
    }
  },
  {
    id: "fighter_battlemaster",
    name: "借机击倒三打菜刀王战大师",
    mainClass: "战士",
    subclass: "战斗大师",
    tier: "T0",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "🛡️",
    summary: "利用战术战术骰（绊摔、反击、推搡攻击）实现绝对单体控制与单轮最高物理输出。",
    multiclass: "12战斗大师",
    attributes: { STR: "17", DEX: "10", CON: "14", INT: "8", WIS: "12", CHA: "8" },
    feats: ["巨武器大师", "警觉", "属性提升 (+2 STR)", "巨武器战术"],
    strategy: [
      "第一击使用‘绊摔攻击’将敌人击倒在地上，后续攻击享用全额近战优势。",
      "开启‘动作如潮’实现一回合三打变六打，精准斩杀任何Boss。"
    ],
    equipment: {
      head: { name: "Helm of Balduran", displayName: "博德安的头盔", rarity: "legendary", regionId: "act3_lower_city", location: "下城区地下巨龙遗迹" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Armor of Persistence", displayName: "永恒执念铠甲 (自带永久剑刃防护)", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 铁匠铺戴摩", isCore: true },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      boots: { name: "Boots of Persistence", displayName: "永恒执念长靴", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 戴摩" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ring2: { name: "Crusher's Ring", displayName: "粉碎机之戒", rarity: "rare", regionId: "act1_goblin_camp", location: "地精营地" },
      mainHand: { name: "Balduran's Giantslayer", displayName: "博德安的巨剑", rarity: "legendary", regionId: "act3_lower_city", location: "下城区地下巨龙遗迹", isCore: true },
      offHand: { name: "Empty", displayName: "双手持握", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "fighter_eldritch",
    name: "酒馆回手投掷奥术骑士",
    mainClass: "战士",
    subclass: "奥术骑士",
    tier: "T0",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "⚡",
    summary: "利用‘绑定武器’技能将任何高伤武器变为回手投掷武器，结合护盾术成为高防高伤投掷战。",
    multiclass: "11奥术骑士 / 1战争牧",
    attributes: { STR: "17", DEX: "14", CON: "14", INT: "10", WIS: "10", CHA: "8" },
    feats: ["酒馆殴斗者", "警觉", "属性提升 (+2 STR)"],
    strategy: [
      "长休后使用‘绑定武器’绑定主手武器（如矮人投掷者/巨剑）。",
      "利用酒馆殴斗者远距离高频投掷该绑定武器，砸向敌人后自动飞回手中。"
    ],
    equipment: {
      head: { name: "Horns of the Berserker", displayName: "狂战士之角", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 恶魔的小品店" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Adamantine Splint Armor", displayName: "精金重甲", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      gloves: { name: "Gloves of Uninhibited Kushigo", displayName: "无拘库席哥手套", rarity: "rare", regionId: "act1_underdark", location: "幽暗地域", isCore: true },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Ring of Flinging", displayName: "投掷戒指", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地", isCore: true },
      ring2: { name: "Caustic Band", displayName: "腐蚀之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      mainHand: { name: "Dwarven Thrower", displayName: "矮人投掷者 (投掷必回手)", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿 - 铁匠铺买卖", isCore: true },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" }
    }
  },

  // ---------------- 武僧 (3) ----------------
  {
    id: "monk_openhand",
    name: "酒馆殴斗散打宗圣徒",
    mainClass: "武僧",
    subclass: "散打宗",
    tier: "T0",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "👊",
    summary: "依托酒馆殴斗者将力量加成双倍叠加至徒手命中与伤害，结合盗贼额外附赠动作一回合8连击。",
    multiclass: "9散打宗 / 3盗贼",
    attributes: { STR: "17", DEX: "16", CON: "14", INT: "8", WIS: "14", CHA: "8" },
    feats: ["酒馆殴斗者", "警觉"],
    strategy: [
      "饮用山丘/云巨人力量药水将力量设为21/27。",
      "使用散打连击击倒敌人，附赠动作连续打出两次疾风连击。"
    ],
    equipment: {
      head: { name: "Horns of the Berserker", displayName: "狂战士之角", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "The Graceful Cloth", displayName: "优雅布衣", rarity: "veryRare", regionId: "act1_mountain_pass", location: "山隘 - 埃斯特" },
      gloves: { name: "Gloves of Soul Catching", displayName: "灵魂捕捉手套", rarity: "legendary", regionId: "act3_house_of_hope", location: "希望之邸 - 拯救赫普后击败拉斐尔", isCore: true },
      boots: { name: "Boots of Uninhibited Kushigo", displayName: "无拘库席哥之靴", rarity: "rare", regionId: "act3_sewers", location: "星界序幕吉斯洋基人掉落", isCore: true },
      amulet: { name: "Sentient Amulet", displayName: "感知护符", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉熔岩宝箱" },
      ring1: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ring2: { name: "Crusher's Ring", displayName: "粉碎机之戒", rarity: "rare", regionId: "act1_goblin_camp", location: "地精营地" },
      mainHand: { name: "Corellon's Grace", displayName: "科瑞隆的恩赐", rarity: "uncommon", regionId: "act1_sunlit_wetlands", location: "鬼婆阿姨" },
      offHand: { name: "Bare Fist", displayName: "空手姿态", rarity: "common", regionId: "act1_emerald_grove", location: "自带" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" }
    }
  },
  {
    id: "monk_shadow",
    name: "暗影步刺客隐秘宗",
    mainClass: "武僧",
    subclass: "暗影宗",
    tier: "T1",
    role: "潜行暗杀",
    difficulty: "中等进阶",
    icon: "🥷",
    summary: "利用暗影步在阴影间无限传送，施展黑暗术配合盲目豁免进行致命潜行打击。",
    multiclass: "8暗影宗 / 4刺客",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "8", WIS: "16", CHA: "10" },
    feats: ["警觉", "属性提升 (+2 DEX)"],
    strategy: [
      "附赠动作使用‘暗影步’传送至敌人身后的阴影区域。",
      "在黑暗术范围内使用偷袭打出暴击，并免疫所有远程魔法锁定。"
    ],
    equipment: {
      head: { name: "Covert Cowl", displayName: "隐秘兜帽", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室" },
      cloak: { name: "Shadow-Cloak", displayName: "阴影斗篷", rarity: "rare", regionId: "act2_shadow_lands", location: "诅咒之地" },
      armor: { name: "Shar's Spear of Evening Armor", displayName: "暗影拥抱胸甲", rarity: "veryRare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      gloves: { name: "Stalker Gloves", displayName: "追踪者手套", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Surge Amulet", displayName: "涌动护符", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉" },
      ring1: { name: "Eversight Ring", displayName: "永视戒指 (免疫失明)", rarity: "uncommon", regionId: "act2_shadow_lands", location: "诅咒之地 - 泥石镇宝箱", isCore: true },
      ring2: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      mainHand: { name: "Shar's Spear of Evening", displayName: "莎尔的暗夜之矛", rarity: "legendary", regionId: "act2_gauntlet_shar", location: "莎尔试炼场杀影心任务", isCore: true },
      offHand: { name: "Bloodthirst", displayName: "饮血者", rarity: "legendary", regionId: "act3_sewers", location: "下水道击败奥林" },
      ranged: { name: "Titanstring Bow", displayName: "泰坦弦弓", rarity: "rare", regionId: "act1_blighted_village", location: "散塔林会藏身处" }
    }
  },
  {
    id: "monk_fouremaster",
    name: "四象法印元素控场武僧",
    mainClass: "武僧",
    subclass: "四象宗",
    tier: "T2",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "🔥",
    summary: "将气转化为火元素与水元素法印，远距离施发冰霜击倒与烈焰轰炸。",
    multiclass: "9四象宗 / 3盗贼",
    attributes: { STR: "8", DEX: "16", CON: "14", INT: "8", WIS: "16", CHA: "10" },
    feats: ["酒馆殴斗者", "属性提升 (+2 WIS)"],
    strategy: [
      "使用‘水之握’将远端敌人拉向己方近战，或使用‘火焰蛇’赋予徒手火焰伤害。"
    ],
    equipment: {
      head: { name: "Hat of Fire Acuity", displayName: "火热热忱帽子", rarity: "veryRare", regionId: "act2_shadow_lands", location: "诅咒之地 - 泥瓦匠公会", isCore: true },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "The Graceful Cloth", displayName: "优雅布衣", rarity: "veryRare", regionId: "act1_mountain_pass", location: "山隘 - 埃斯特" },
      gloves: { name: "Cinder-Sufferer Gloves", displayName: "灰烬手套", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Boots of Uninhibited Kushigo", displayName: "无拘库席哥之靴", rarity: "rare", regionId: "act3_sewers", location: "星界序幕" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      ring2: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      mainHand: { name: "Corellon's Grace", displayName: "科瑞隆的恩赐", rarity: "uncommon", regionId: "act1_sunlit_wetlands", location: "鬼婆阿姨" },
      offHand: { name: "Bare Fist", displayName: "空手姿态", rarity: "common", regionId: "act1_emerald_grove", location: "自带" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" }
    }
  },

  // ---------------- 圣骑士 (4) ----------------
  {
    id: "paladin_ancients",
    name: "古圣光环减伤治疗守护帕",
    mainClass: "圣骑士",
    subclass: "古圣誓言",
    tier: "T1",
    role: "团队辅助",
    difficulty: "入门简单",
    icon: "🍃",
    summary: "拥有守护光环使周围队友受到的法术伤害直接减半，结合治愈之光提供强力急救。",
    multiclass: "7古圣帕 / 5至高邪术师",
    attributes: { STR: "16", DEX: "10", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["巨武器大师", "属性提升 (+2 CHA)"],
    strategy: [
      "保持在队伍中央展开‘守护光环’，为全队提供伤害豁免与减半法伤。",
      "利用邪术师短休恢复的法术位施放高阶至圣斩（Smite）。"
    ],
    equipment: {
      head: { name: "Helm of Balduran", displayName: "博德安的头盔", rarity: "legendary", regionId: "act3_lower_city", location: "下城区巨龙遗迹" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Armor of Persistence", displayName: "永恒执念铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 戴摩", isCore: true },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of Devotion", displayName: "虔信者护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区礼拜堂" },
      ring1: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring2: { name: "Whispering Promise", displayName: "低语之约", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      mainHand: { name: "Balduran's Giantslayer", displayName: "博德安的巨剑", rarity: "legendary", regionId: "act3_lower_city", location: "下城区巨龙遗迹", isCore: true },
      offHand: { name: "Empty", displayName: "双手武器姿态", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "paladin_devotion",
    name: "圣化武器正义重甲帕",
    mainClass: "圣骑士",
    subclass: "奉献誓言",
    tier: "T1",
    role: "前排坦克",
    difficulty: "入门简单",
    icon: "✝️",
    summary: "使用圣化武器将魅力修正附加至命中骰，克服巨武器大师的命中惩罚，打出稳定斩杀。",
    multiclass: "6奉献帕 / 6冠军勇士",
    attributes: { STR: "16", DEX: "10", CON: "14", INT: "8", WIS: "10", CHA: "16" },
    feats: ["巨武器大师", "警觉"],
    strategy: [
      "战前开启‘圣化武器’，命中率大幅度提升。",
      "配合至圣斩与动作如潮，在单轮内迅速击杀精英要害目标。"
    ],
    equipment: {
      head: { name: "Helm of Balduran", displayName: "博德安的头盔", rarity: "legendary", regionId: "act3_lower_city", location: "下城区巨龙遗迹" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Adamantine Splint Armor", displayName: "精金重甲", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉", isCore: true },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      ring2: { name: "Ring of Absolute Force", displayName: "绝对者之力戒指", rarity: "uncommon", regionId: "act1_grymforge", location: "复仇之炉" },
      mainHand: { name: "Devotee's Mace", displayName: "信徒之锤 (召唤传奇神锤)", rarity: "legendary", regionId: "act3_lower_city", location: "10级牧师神性干预获取", isCore: true },
      offHand: { name: "Viconia's Walking Fortress", displayName: "维康尼亚的行走堡垒", rarity: "legendary", regionId: "act3_house_of_grief", location: "哀伤之邸" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "paladin_vengeance",
    name: "锁定优势至圣斩锁帕",
    mainClass: "圣骑士",
    subclass: "复仇誓言",
    tier: "T0",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "⚔️",
    summary: "使用复仇誓言敌对誓言锁定目标获得永久攻击优势，结合至圣斩与邪术师魔能刃瞬间秒杀。",
    multiclass: "7复仇帕 / 5至高邪术师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["巨武器大师", "属性提升 (+2 CHA)"],
    strategy: [
      "开启‘敌对誓言’施加于目标身上获得全攻击优势。",
      "借助刃之契约将攻击与伤害加成转为魅力，打出满级至圣斩暴击。"
    ],
    equipment: {
      head: { name: "Helm of Balduran", displayName: "博德安的头盔", rarity: "legendary", regionId: "act3_lower_city", location: "下城区地下巨龙遗迹" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Armor of Persistence", displayName: "永恒执念铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 铁匠铺戴摩" },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阿剌吉", isCore: true },
      ring2: { name: "Killer's Sweetheart", displayName: "杀手甜心", rarity: "veryRare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      mainHand: { name: "Balduran's Giantslayer", displayName: "博德安的巨剑", rarity: "legendary", regionId: "act3_lower_city", location: "下城区地下巨龙遗迹", isCore: true },
      offHand: { name: "Empty", displayName: "双手武器姿态", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "paladin_oathbreaker",
    name: "邪灵光环黑骑士破誓帕",
    mainClass: "圣骑士",
    subclass: "破誓者",
    tier: "T0",
    role: "单体爆发",
    difficulty: "中等进阶",
    icon: "💀",
    summary: "开启仇恨光环将魅力修正直接叠加至近战坏死伤害，同时控制周围不死生物作战。",
    multiclass: "7破誓帕 / 5邪魔邪术师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["巨武器大师", "属性提升 (+2 CHA)"],
    strategy: [
      "开启‘仇恨光环’（Aura of Hate），全队近战与召唤物额外享受巨额坏死伤害加成。",
      "对敌方不死生物施展‘控制不死生物’直接据为己有。"
    ],
    equipment: {
      head: { name: "Sarevok's Horned Helmet", displayName: "沙洛佛克的角头盔", rarity: "veryRare", regionId: "act3_sewers", location: "下水道 - 沙洛佛克掉落", isCore: true },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Armor of Persistence", displayName: "永恒执念铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      gloves: { name: "Gauntlets of Hill Giant Strength", displayName: "丘陵巨人力气手套", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      ring2: { name: "Ring of Absolute Force", displayName: "绝对者之力戒指", rarity: "uncommon", regionId: "act1_grymforge", location: "复仇之炉" },
      mainHand: { name: "Shar's Spear of Evening", displayName: "莎尔的暗夜之矛", rarity: "legendary", regionId: "act2_gauntlet_shar", location: "莎尔试炼场", isCore: true },
      offHand: { name: "Empty", displayName: "双手武器姿态", rarity: "common", regionId: "act1_emerald_grove", location: "无" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },

  // ---------------- 游侠 (3) ----------------
  {
    id: "ranger_hunter",
    name: "旋风斩多重箭狙击手",
    mainClass: "游侠",
    subclass: "猎人",
    tier: "T1",
    role: "群体AOE",
    difficulty: "入门简单",
    icon: "🏹",
    summary: "11级获得无消耗‘漩涡打击’与‘多重射击’，成为不消耗法术位的物理AOE清场大师。",
    multiclass: "11猎人 / 1战士",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "8", WIS: "14", CHA: "10" },
    feats: ["神射手", "属性提升 (+2 DEX)"],
    strategy: [
      "面对密集的敌人群体施展11级技能‘漩涡攻击’（远程/近战均可），对范围内所有目标各打一箭。"
    ],
    equipment: {
      head: { name: "Mask of Soul Perception", displayName: "灵魂察觉面具", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Armor of Agility", displayName: "敏捷铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 军械库", isCore: true },
      gloves: { name: "Stalker Gloves", displayName: "追踪者手套", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Surge Amulet", displayName: "涌动护符", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉" },
      ring1: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔", isCore: true },
      ring2: { name: "Caustic Band", displayName: "腐蚀之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Bloodthirst", displayName: "饮血者", rarity: "legendary", regionId: "act3_sewers", location: "下水道" },
      ranged: { name: "The Dead Shot", displayName: "致命一击长弓", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区", isCore: true }
    }
  },
  {
    id: "ranger_beastmaster",
    name: "野猪乌鸦伙伴召唤大军",
    mainClass: "游侠",
    subclass: "驯兽师",
    tier: "T1",
    role: "召唤军团",
    difficulty: "中等进阶",
    icon: "🦅",
    summary: "召唤具有完全成长属性的装甲熊、恶魔巨猪或乌鸦，伙伴享有二次攻击与独立技能。",
    multiclass: "11驯兽师 / 1战士",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "8", WIS: "14", CHA: "10" },
    feats: ["神射手", "属性提升 (+2 DEX)"],
    strategy: [
      "召唤野猪伴侣进行冲撞击倒敌人，或召唤巨型乌鸦造成全场盲目。",
      "本体在后排使用泰坦弦弓安心输出。"
    ],
    equipment: {
      head: { name: "Marksmanship Hat", displayName: "神射手帽子", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 罗阿" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Armor of Agility", displayName: "敏捷铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      gloves: { name: "Gloves of Archery", displayName: "弓箭手手套", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地 - 格拉布" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Caustic Band", displayName: "腐蚀之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      mainHand: { name: "Corellon's Grace", displayName: "科瑞隆的恩赐", rarity: "uncommon", regionId: "act1_sunlit_wetlands", location: "鬼婆阿姨" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Titanstring Bow", displayName: "泰坦弦弓 (力量加成至伤害)", rarity: "rare", regionId: "act1_blighted_village", location: "散塔林会藏身处", isCore: true }
    }
  },
  {
    id: "ranger_gloomstalker",
    name: "先攻致命阴影刺客游侠",
    mainClass: "游侠",
    subclass: "暗影游侠",
    tier: "T0",
    role: "潜行暗杀",
    difficulty: "进阶高伤",
    icon: "🎯",
    summary: "先攻必胜首轮多连发，结合刺客对未行动目标的100%全额暴击隐秘狙击。",
    multiclass: "5暗影游侠 / 3刺客 / 4冠军勇士",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "8", WIS: "14", CHA: "10" },
    feats: ["神射手", "属性提升 (+2 DEX)"],
    strategy: [
      "隐匿潜行开怪，享用‘无惧伏击’带来的额外首轮免费攻击与动作刷新。",
      "搭配风险戒指获得永久攻击优势，彻底抵消神射手-5命中惩罚。"
    ],
    equipment: {
      head: { name: "Covert Cowl", displayName: "隐秘兜帽", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店地下室" },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 盗贼公会", isCore: true },
      armor: { name: "Armor of Agility", displayName: "敏捷铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 军械库" },
      gloves: { name: "Stalker Gloves", displayName: "追踪者手套", rarity: "rare", regionId: "act3_rivington", location: "利文顿 - 铁匠铺" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Surge Amulet", displayName: "涌动护符", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉" },
      ring1: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阿剌吉", isCore: true },
      ring2: { name: "Caustic Band", displayName: "腐蚀之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Bloodthirst", displayName: "饮血者", rarity: "legendary", regionId: "act3_sewers", location: "下水道" },
      ranged: { name: "Titanstring Bow", displayName: "泰坦弦弓", rarity: "rare", regionId: "act1_blighted_village", location: "散塔林会藏身处", isCore: true }
    }
  },

  // ---------------- 游荡者 (3) ----------------
  {
    id: "rogue_assassin",
    name: "隐匿首轮全暴击杀手",
    mainClass: "游荡者",
    subclass: "刺客",
    tier: "T1",
    role: "潜行暗杀",
    difficulty: "中等进阶",
    icon: "🗡️",
    summary: "对未行动敌人攻击自带优势，对处于惊讶状态的敌方全额100%强制暴击。",
    multiclass: "5暗影游侠 / 4刺客 / 3冠军勇士",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "8", WIS: "14", CHA: "10" },
    feats: ["神射手", "警觉"],
    strategy: [
      "从视野盲区发起偷袭使全场进入【惊讶】状态。",
      "利用刺客回满动作点数特性，连续输出全额暴击射击。"
    ],
    equipment: {
      head: { name: "Covert Cowl", displayName: "隐秘兜帽", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区", isCore: true },
      armor: { name: "Armor of Agility", displayName: "敏捷铠甲", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      gloves: { name: "Stalker Gloves", displayName: "追踪者手套", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Broodmother's Revenge", displayName: "育母之复仇", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔", isCore: true },
      ring2: { name: "Killer's Sweetheart", displayName: "杀手甜心", rarity: "veryRare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Bloodthirst", displayName: "饮血者", rarity: "legendary", regionId: "act3_sewers", location: "下水道" },
      ranged: { name: "The Dead Shot", displayName: "致命一击长弓", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" }
    }
  },
  {
    id: "rogue_thief",
    name: "双附赠动作万用兼职盗贼",
    mainClass: "游荡者",
    subclass: "盗贼",
    tier: "T0",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "💰",
    summary: "提供游戏内唯一的额外附赠动作，是武僧、双持手弩、投掷蛮等全系T0流派的基石。",
    multiclass: "4盗贼 / 8散打宗 (或双手弩)",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "8", WIS: "14", CHA: "10" },
    feats: ["神射手/酒馆殴斗", "警觉"],
    strategy: [
      "一回合消耗两个附赠动作施放两次副手手弩射击或两次疾风连击。"
    ],
    equipment: {
      head: { name: "Horns of the Berserker", displayName: "狂战士之角", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "The Graceful Cloth", displayName: "优雅布衣", rarity: "veryRare", regionId: "act1_mountain_pass", location: "山隘" },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间", isCore: true },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Surge Amulet", displayName: "涌动护符", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉" },
      ring1: { name: "Caustic Band", displayName: "腐蚀之戒", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      ring2: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Belm", displayName: "贝姆", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      ranged: { name: "Firestoker", displayName: "纵火者手弩", rarity: "rare", regionId: "act1_grymforge", location: "复仇之炉宝箱", isCore: true }
    }
  },
  {
    id: "rogue_arcanetrickster",
    name: "隐形法师手掌偷窃法贼",
    mainClass: "游荡者",
    subclass: "奥术诡客",
    tier: "T2",
    role: "团队辅助",
    difficulty: "中等进阶",
    icon: "🪄",
    summary: "利用永久隐形的隐形法师之手在战斗前搜刮敌方关键药水与武器，做战前解构。",
    multiclass: "12奥术诡客",
    attributes: { STR: "8", DEX: "17", CON: "14", INT: "14", WIS: "10", CHA: "8" },
    feats: ["警觉", "属性提升 (+2 DEX)"],
    strategy: [
      "召唤隐形法师手掌潜入敌阵偷走商人的药水或直接解除敌人的武器。",
      "利用神奇伏击（Magical Ambush）使隐匿状态下的法术豁免率大大降低。"
    ],
    equipment: {
      head: { name: "Warped Headband of Intellect", displayName: "歪曲的智力头带", rarity: "uncommon", regionId: "act1_blighted_village", location: "染疫村庄", isCore: true },
      cloak: { name: "Shadow-Cloak", displayName: "阴影斗篷", rarity: "rare", regionId: "act2_shadow_lands", location: "诅咒之地" },
      armor: { name: "The Graceful Cloth", displayName: "优雅布衣", rarity: "veryRare", regionId: "act1_mountain_pass", location: "山隘", isCore: true },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Guidance Amulet", displayName: "引导护符", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Smuggler's Ring", displayName: "走私者之戒 (+2隐匿/+2手指轻快)", rarity: "uncommon", regionId: "act1_emerald_grove", location: "染疫村庄桥下骷髅" },
      ring2: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Titanstring Bow", displayName: "泰坦弦弓", rarity: "rare", regionId: "act1_blighted_village", location: "散塔林会" }
    }
  },

  // ---------------- 术士 (3) ----------------
  {
    id: "sorc_wildmagic",
    name: "幸运骰法术狂潮术士",
    mainClass: "术士",
    subclass: "狂野魔法",
    tier: "T3",
    role: "群体AOE",
    difficulty: "入门简单",
    icon: "🎲",
    summary: "利用狂野魔法激浪获得检定优势，享受充满随机乐趣的魔法湍流与幸运逆转。",
    multiclass: "12狂野魔法术士",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["幸运 (Lucky)", "属性提升 (+2 CHA)"],
    strategy: [
      "主动开启‘混沌控制’触发狂野魔法湍流。",
      "配合幸运特长重投关键豁免，体验充满剧情碰撞的法术冒险。"
    ],
    equipment: {
      head: { name: "Birthright", displayName: "诞生之冠", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 罗兰" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Potent Robe", displayName: "潜能法袍", rarity: "veryRare", regionId: "act2_last_light_inn", location: "终焉之光旅店", isCore: true },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Fey Semblance Amulet", displayName: "妖精幻象护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "sorc_draconic",
    name: "炽热热忱射线火龙术",
    mainClass: "术士",
    subclass: "龙脉术士",
    tier: "T0",
    role: "单体爆发",
    difficulty: "高阶流派",
    icon: "🔥",
    summary: "利用多发炽热射线快速叠加火热热忱法术DC，随后施放100%无法豁免的绝对控制与爆炎。",
    multiclass: "11火龙术 / 1法师",
    attributes: { STR: "8", DEX: "15", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["元素专精: 火焰", "属性提升 (+2 CHA)"],
    strategy: [
      "施放6环炽热射线射出7发火弹，瞬间在帽子上叠满7层火热热忱（DC+7）。",
      "使用超魔附赠动作施放人类定身术/控制怪物，锁定100%成功率。"
    ],
    equipment: {
      head: { name: "Hat of Fire Acuity", displayName: "火热热忱帽子", rarity: "veryRare", regionId: "act2_shadow_lands", location: "诅咒之地 - 泥瓦匠公会", isCore: true },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Potent Robe", displayName: "潜能法袍 (魅力叠加额外伤害)", rarity: "veryRare", regionId: "act2_last_light_inn", location: "终焉之光旅店", isCore: true },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" }
    }
  },
  {
    id: "sorc_storm",
    name: "连锁闪电飞天风暴术",
    mainClass: "术士",
    subclass: "风暴术士",
    tier: "T0",
    role: "群体AOE",
    difficulty: "中等进阶",
    icon: "⚡",
    summary: "施法后获得免费飞行能力，配合孪生超魔在湿润地形上一次性打出两发连锁闪电。",
    multiclass: "10风暴术士 / 2风暴牧",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "12", CHA: "17" },
    feats: ["元素专精: 闪电", "属性提升 (+2 CHA)"],
    strategy: [
      "造水术造成【湿润】翻倍效果，使用超魔‘孪生法术’一次施放两发连锁闪电。",
      "触发暴风急流自由飞行拉开与敌方近战的距离。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Watersparkers", displayName: "水火不侵之靴", rarity: "rare", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Amulet of the Devout", displayName: "虔信者护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区礼拜堂", isCore: true },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Callous Glow Ring", displayName: "冷酷光芒戒指", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },

  // ---------------- 邪术师 (3) ----------------
  {
    id: "warlock_archfey",
    name: "魅惑迷踪恐惧邪术师",
    mainClass: "邪术师",
    subclass: "至高妖精",
    tier: "T2",
    role: "控场大师",
    difficulty: "入门简单",
    icon: "🧝",
    summary: "受到伤害时可自动施展隐形与迷踪步逃逸，主打魅惑、恐惧与极高机动战场控场。",
    multiclass: "12至高妖精邪术师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["警觉", "属性提升 (+2 CHA)"],
    strategy: [
      "使用‘妖精之威’使周围敌人陷入恐惧与魅惑状态。",
      "被近战靠近受击瞬间触发‘迷踪逃逸’自动隐身并传送至高地。"
    ],
    equipment: {
      head: { name: "Birthright", displayName: "诞生之冠", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区 - 罗兰" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Potent Robe", displayName: "潜能法袍", rarity: "veryRare", regionId: "act2_last_light_inn", location: "终焉之光旅店", isCore: true },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Fey Semblance Amulet", displayName: "妖精幻象护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区", isCore: true },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "warlock_fiend",
    name: "灼热火球阿斯莫德邪术师",
    mainClass: "邪术师",
    subclass: "邪魔",
    tier: "T1",
    role: "单体爆发",
    difficulty: "入门简单",
    icon: "🔥",
    summary: "击杀目标获取临时生命值，拥有火球术与火热射线，结合魔能爆打出稳定高输出。",
    multiclass: "12邪魔邪术师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["元素专精: 火焰", "属性提升 (+2 CHA)"],
    strategy: [
      "击杀目标触发‘邪魔恩赐’获取生命充能。",
      "利用短休恢复的最高阶法术位频繁施放火球术与灼热射线。"
    ],
    equipment: {
      head: { name: "Hat of Fire Acuity", displayName: "火热热忱帽子", rarity: "veryRare", regionId: "act2_shadow_lands", location: "诅咒之地", isCore: true },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Potent Robe", displayName: "潜能法袍", rarity: "veryRare", regionId: "act2_last_light_inn", location: "终焉之光旅店", isCore: true },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Callous Glow Ring", displayName: "冷酷光芒戒指", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Darkfire Shortbow", displayName: "火暗短弓", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" }
    }
  },
  {
    id: "warlock_goo",
    name: "暴击恐惧魔爆机关枪",
    mainClass: "邪术师",
    subclass: "异界旧日支配者",
    tier: "T0",
    role: "单体爆发",
    difficulty: "中等进阶",
    icon: "👁️",
    summary: "利用致命一击触发现发大范围【恐惧】，配合潜能法袍与多重魔能爆打出加特林轰炸。",
    multiclass: "2邪术师 / 6术士 / 4冠军勇士",
    attributes: { STR: "8", DEX: "15", CON: "14", INT: "8", WIS: "10", CHA: "17" },
    feats: ["警觉", "属性提升 (+2 CHA)"],
    strategy: [
      "开启术士‘瞬发法术’超魔，一回合打出两发（共6光束）魔能爆。",
      "暴击时触发‘死命恐惧’让目标及周围所有敌方放弃行动。"
    ],
    equipment: {
      head: { name: "Sarevok's Horned Helmet", displayName: "沙洛佛克的角头盔", rarity: "veryRare", regionId: "act3_sewers", location: "下水道沙洛佛克" },
      cloak: { name: "Shade-Slayer Cloak", displayName: "弑影者斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Potent Robe", displayName: "潜能法袍 (魅力叠加至每发魔能爆)", rarity: "veryRare", regionId: "act2_last_light_inn", location: "终焉之光旅店", isCore: true },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套 (戏法+1d8伤害)", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿", isCore: true },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Spine Shudder Amulet", displayName: "脊椎战栗护符", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ring1: { name: "Callous Glow Ring", displayName: "冷酷光芒戒指", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      ring2: { name: "Risky Ring", displayName: "风险戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔 - 阿剌吉" },
      mainHand: { name: "Knife of the Undermountain King", displayName: "山丘之王短刀", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      offHand: { name: "Bloodthirst", displayName: "饮血者", rarity: "legendary", regionId: "act3_sewers", location: "下水道" },
      ranged: { name: "The Dead Shot", displayName: "致命一击长弓", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" }
    }
  },

  // ---------------- 法师 (8) ----------------
  {
    id: "wiz_abjuration",
    name: "护甲无敌反伤冰法",
    mainClass: "法师",
    subclass: "防护学派",
    tier: "T0",
    role: "前排坦克",
    difficulty: "中等进阶",
    icon: "🛡️",
    summary: "依托奥术法房叠满减伤，配合阿加斯之铠反弹巨额冰霜伤害，实现站着不动震死全场敌人。",
    multiclass: "10防护法师 / 1龙脉术士 / 1圣骑士",
    attributes: { STR: "8", DEX: "14", CON: "16", INT: "17", WIS: "10", CHA: "8" },
    feats: ["战术精通", "属性提升 (+2 INT)"],
    strategy: [
      "战前挂高环阶‘阿加斯之铠’与‘防护法房’（具有最高20点绝对减伤）。",
      "故意引诱敌方近战攻击自己，受击时完全不掉血并向敌方反弹40-60点冰霜伤害。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Winter's Clutches", displayName: "凛冬之拥", rarity: "uncommon", regionId: "act1_mountain_pass", location: "山隘" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Snowburst Ring", displayName: "雪暴戒指", rarity: "uncommon", regionId: "act2_shadow_lands", location: "诅咒之地", isCore: true },
      ring2: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      mainHand: { name: "Mourning Frost", displayName: "哀悼霜雪法杖", rarity: "veryRare", regionId: "act1_underdark", location: "幽暗地域合成", isCore: true },
      offHand: { name: "Viconia's Walking Fortress", displayName: "维康尼亚的行走堡垒", rarity: "legendary", regionId: "act3_house_of_grief", location: "哀伤之邸" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "wiz_evocation",
    name: "法术无误伤核爆大师",
    mainClass: "法师",
    subclass: "塑能学派",
    tier: "T1",
    role: "群体AOE",
    difficulty: "入门简单",
    icon: "💥",
    summary: "被动‘法术塑形’使所有塑能法术自动避开队友，随意在队伍脚下轰炸火球术与死云术。",
    multiclass: "12塑能法师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "10", CHA: "10" },
    feats: ["警觉", "属性提升 (+2 INT)"],
    strategy: [
      "即使队友陷入敌群包围，直接对队伍中央释放6环火球术或冰风暴，队友自动免受伤害。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of the Devout", displayName: "虔信者护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区礼拜堂" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Callous Glow Ring", displayName: "冷酷光芒戒指", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "wiz_necromancy",
    name: "狂怒死灵僵尸大军法师",
    mainClass: "法师",
    subclass: "死灵学派",
    tier: "T1",
    role: "召唤军团",
    difficulty: "中等进阶",
    icon: "🧟",
    summary: "死灵仆从额外增加血量与伤害，配合珍爱死灵法杖无限免消耗施放死灵法术。",
    multiclass: "12死灵法师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "10", CHA: "8" },
    feats: ["战术精通", "属性提升 (+2 INT)"],
    strategy: [
      "施放‘操纵死尸’复活多个强化食尸鬼与僵尸组建防线。",
      "手持珍爱死灵法杖杀死敌人积累死灵生命，无消耗连发凋零术。"
    ],
    equipment: {
      head: { name: "Circle of Bones", displayName: "白骨之冠", rarity: "rare", regionId: "act2_gauntlet_shar", location: "莎尔试炼场" },
      cloak: { name: "Crypt Lord Cloak", displayName: "地穴领主斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区卡里翁" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Crypt Lord Ring", displayName: "死灵召集戒指", rarity: "rare", regionId: "act3_lower_city", location: "下城区" },
      ring2: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      mainHand: { name: "Staff of Cherished Necromancy", displayName: "珍爱死灵法杖", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区卡里翁掉落", isCore: true },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "wiz_divination",
    name: "改写命运预言控制大师",
    mainClass: "法师",
    subclass: "预言学派",
    tier: "T0",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "🔮",
    summary: "利用预兆骰子（Portent Dice）强制替换敌我的攻击骰与豁免骰，强制决定战斗胜负。",
    multiclass: "2预言法师 / 10传说诗人 (或12纯预言)",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "10", CHA: "8" },
    feats: ["警觉", "属性提升 (+2 INT)"],
    strategy: [
      "长休后获得预兆骰子（如1和20）。",
      "施放人类定身术时直接用1点预兆骰替换Boss的豁免骰，强制命中！"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Amulet of the Devout", displayName: "虔信者护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区礼拜堂", isCore: true },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Strange Conduit Ring", displayName: "奇异管道戒指", rarity: "rare", regionId: "act1_mountain_pass", location: "养育间" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "wiz_enchantment",
    name: "双重心智控制惑控法师",
    mainClass: "法师",
    subclass: "惑控学派",
    tier: "T2",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "🌀",
    summary: "10级被动‘双重惑控’可使所有单体惑控法术（如人类定身术、支配人类）自动免费作用于2个目标。",
    multiclass: "12惑控法师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "10", CHA: "8" },
    feats: ["警觉", "属性提升 (+2 INT)"],
    strategy: [
      "施展‘支配怪物’或‘人类定身术’，免费同时控制战场上的两名敌方主将。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Disintegrating Night Walkers", displayName: "瓦解之夜足", rarity: "veryRare", regionId: "act1_grymforge", location: "复仇之炉" },
      amulet: { name: "Fey Semblance Amulet", displayName: "妖精幻象护符", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      ring1: { name: "Band of the Mystic Scoundrel", displayName: "神秘刺客之环", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿", isCore: true },
      ring2: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  },
  {
    id: "wiz_illusion",
    name: "镜像虚幻戏耍幻术法师",
    mainClass: "法师",
    subclass: "幻术学派",
    tier: "T3",
    role: "控场大师",
    difficulty: "中等进阶",
    icon: "🎭",
    summary: "利用附赠动作施展次级幻影，并在受到攻击时使用‘虚空照映’使攻击自动 MISS。",
    multiclass: "12幻术法师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "10", CHA: "8" },
    feats: ["警觉", "属性提升 (+2 INT)"],
    strategy: [
      "战斗中施放次级幻影吸引全场敌人注意力并将其拉拢至一堆。",
      "敌人攻击时触发‘虚无退避’自动闪避。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Evasive Shoes", displayName: "闪避之靴", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring2: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      mainHand: { name: "Staff of Arcane Blessing", displayName: "奥术祝福法杖", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" }
    }
  },
  {
    id: "wiz_transmutation",
    name: "药水双倍制造炼金变化法",
    mainClass: "法师",
    subclass: "变化学派",
    tier: "T2",
    role: "团队辅助",
    difficulty: "入门简单",
    icon: "🧪",
    summary: "通过医药检定在炼金时100%产出双倍药水（如山丘/云巨人药水、速度之油），并制作变化石增益。",
    multiclass: "6变化法师 / 6流浪者",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "16 (医药熟练)", CHA: "8" },
    feats: ["幸运", "属性提升 (+2 WIS)"],
    strategy: [
      "驻扎在营地专门合成全队药水与灵药，每次炼金检定成功直接获得双倍成果。",
      "携带变化石为队友提供移动速度或抗性。"
    ],
    equipment: {
      head: { name: "Warped Headband of Intellect", displayName: "歪曲的智力头带", rarity: "uncommon", regionId: "act1_blighted_village", location: "染疫村庄", isCore: true },
      cloak: { name: "Cloak of Displacement", displayName: "位移斗篷", rarity: "rare", regionId: "act3_rivington", location: "利文顿" },
      armor: { name: "The Graceful Cloth", displayName: "优雅布衣 (优势医药检定)", rarity: "veryRare", regionId: "act1_mountain_pass", location: "山隘", isCore: true },
      gloves: { name: "Gloves of Dexterity", displayName: "敏捷手套", rarity: "veryRare", regionId: "act1_mountain_pass", location: "养育间" },
      boots: { name: "Boots of Striding", displayName: "阔步者之靴", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Guidance Amulet", displayName: "引导护符", rarity: "uncommon", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring1: { name: "Ring of Protection", displayName: "防护戒指", rarity: "rare", regionId: "act1_emerald_grove", location: "翠绿林地" },
      ring2: { name: "Mage's Friend", displayName: "法师之友", rarity: "uncommon", regionId: "act1_underdark", location: "幽暗地域" },
      mainHand: { name: "Corellon's Grace", displayName: "科瑞隆的恩赐", rarity: "uncommon", regionId: "act1_sunlit_wetlands", location: "鬼婆阿姨" },
      offHand: { name: "Shield of Devotion", displayName: "虔诚之盾", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ranged: { name: "Bow of Awareness", displayName: "警觉之弓", rarity: "uncommon", regionId: "act1_goblin_camp", location: "地精营地" }
    }
  },
  {
    id: "wiz_conjuration",
    name: "元素召唤物与传送咒法师",
    mainClass: "法师",
    subclass: "咒法学派",
    tier: "T2",
    role: "召唤军团",
    difficulty: "入门简单",
    icon: "🌟",
    summary: "专注状态不会因受击而中断，同时具备无消耗良性换位传送与高级元素灵召唤。",
    multiclass: "12咒法法师",
    attributes: { STR: "8", DEX: "14", CON: "14", INT: "17", WIS: "10", CHA: "8" },
    feats: ["警觉", "属性提升 (+2 INT)"],
    strategy: [
      "召唤元素侍从（水/火元素）共同作战。",
      "利用‘良性调换’随时与队友交换位置，摆脱敌方刺客缠斗。"
    ],
    equipment: {
      head: { name: "Hood of the Weave", displayName: "织网兜帽", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      cloak: { name: "Cloak of the Weave", displayName: "织网斗篷", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区" },
      armor: { name: "Robe of the Weave", displayName: "织网法袍", rarity: "veryRare", regionId: "act3_lower_city", location: "下城区高塔" },
      gloves: { name: "Spellmight Gloves", displayName: "法术威力手套", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" },
      boots: { name: "Watersparkers", displayName: "水火不侵之靴", rarity: "rare", regionId: "act1_goblin_camp", location: "地精营地" },
      amulet: { name: "Amulet of Greater Health", displayName: "高等体质护符", rarity: "veryRare", regionId: "act3_house_of_hope", location: "希望之邸" },
      ring1: { name: "Ring of Coruscation", displayName: "闪烁之戒", rarity: "rare", regionId: "act2_last_light_inn", location: "终焉之光旅店" },
      ring2: { name: "Ring of Free Action", displayName: "自由行动戒指", rarity: "rare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      mainHand: { name: "Markoheshkir", displayName: "马科赫什基", rarity: "legendary", regionId: "act3_lower_city", location: "下城区高塔", isCore: true },
      offHand: { name: "Ketheric's Shield", displayName: "凯瑟里克之盾", rarity: "veryRare", regionId: "act2_moonrise_towers", location: "月出之塔" },
      ranged: { name: "Hellrider Longbow", displayName: "地狱骑士长弓", rarity: "veryRare", regionId: "act3_rivington", location: "利文顿" }
    }
  }
];

// Helper to determine item rarity styles
const getRarityStyle = (rarity) => {
  switch (rarity) {
    case 'uncommon':
      return {
        border: 'border-emerald-500/80',
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/20',
        glow: 'shadow-[0_0_8px_rgba(16,185,129,0.25)]',
        label: '优秀 (Uncommon)'
      };
    case 'rare':
      return {
        border: 'border-blue-500/80',
        text: 'text-blue-400',
        bg: 'bg-blue-950/20',
        glow: 'shadow-[0_0_8px_rgba(59,130,246,0.25)]',
        label: '稀有 (Rare)'
      };
    case 'veryRare':
      return {
        border: 'border-purple-500/80',
        text: 'text-purple-400',
        bg: 'bg-purple-950/20',
        glow: 'shadow-[0_0_10px_rgba(168,85,247,0.3)]',
        label: '珍奇 (Very Rare)'
      };
    case 'legendary':
      return {
        border: 'border-amber-400',
        text: 'text-amber-300',
        bg: 'bg-amber-950/30',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
        label: '传奇 (Legendary)'
      };
    default:
      return {
        border: 'border-slate-700',
        text: 'text-slate-300',
        bg: 'bg-slate-900/40',
        glow: '',
        label: '普通'
      };
  }
};

const getTierBadgeStyle = (tier) => {
  switch (tier) {
    case 'T0':
      return 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] font-extrabold';
    case 'T1':
      return 'bg-purple-950/90 text-purple-300 border-purple-500/80 font-bold';
    case 'T2':
      return 'bg-blue-950/90 text-blue-300 border-blue-500/80 font-semibold';
    case 'T3':
      return 'bg-slate-800 text-slate-300 border-slate-600 font-normal';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
};

export default function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [checkedRegions, setCheckedRegions] = useState(
    new Set(["act1_emerald_grove", "act1_blighted_village", "act1_goblin_camp", "act1_underdark"])
  );
  
  const [selectedBuildId, setSelectedBuildId] = useState(BUILDS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Multi-filtering states
  const [selectedClass, setSelectedClass] = useState("全部职业");
  const [selectedRole, setSelectedRole] = useState("全部定位");
  const [selectedTier, setSelectedTier] = useState("全部 Tier");
  const [onlyCoreUnlocked, setOnlyCoreUnlocked] = useState(false); // CORE GEAR FILTER TOGGLE
  const [activeTab, setActiveTab] = useState("paperdoll"); // "paperdoll" | "strategy"

  // Current active build details
  const activeBuild = useMemo(() => {
    return BUILDS_DATA.find(b => b.id === selectedBuildId) || BUILDS_DATA[0];
  }, [selectedBuildId]);

  // Handle region toggles
  const toggleRegion = (regionId) => {
    const next = new Set(checkedRegions);
    if (next.has(regionId)) {
      next.delete(regionId);
    } else {
      next.add(regionId);
    }
    setCheckedRegions(next);
  };

  // Quick Region Selection helpers
  const selectAllAct = (actNum) => {
    const actData = ACT_REGIONS.find(a => a.act === actNum);
    if (!actData) return;
    const next = new Set(checkedRegions);
    actData.regions.forEach(r => next.add(r.id));
    setCheckedRegions(next);
  };

  const selectAllRegions = () => {
    const all = new Set();
    ACT_REGIONS.forEach(act => act.regions.forEach(r => all.add(r.id)));
    setCheckedRegions(all);
  };

  const clearAllRegions = () => {
    setCheckedRegions(new Set());
  };

  // Calculate Build Gear Unlock Stats
  const getBuildGearStats = (build) => {
    const slots = Object.keys(build.equipment);
    let unlockedCount = 0;
    let coreTotal = 0;
    let coreUnlocked = 0;
    
    slots.forEach(slotKey => {
      const item = build.equipment[slotKey];
      if (item) {
        const isUnlocked = checkedRegions.has(item.regionId);
        if (isUnlocked) unlockedCount++;
        
        if (item.isCore) {
          coreTotal++;
          if (isUnlocked) coreUnlocked++;
        }
      }
    });

    const total = slots.length;
    const percentage = Math.round((unlockedCount / total) * 100);
    const isCoreFullyUnlocked = coreTotal > 0 ? (coreUnlocked === coreTotal) : true;

    return { unlockedCount, total, percentage, coreTotal, coreUnlocked, isCoreFullyUnlocked };
  };

  // Filtered Builds based on Class, Role, Tier, Search Query & Core Gear Toggle
  const filteredBuilds = useMemo(() => {
    return BUILDS_DATA.filter(build => {
      // 1. Class filter
      if (selectedClass !== "全部职业" && build.mainClass !== selectedClass) {
        return false;
      }

      // 2. Role filter
      if (selectedRole !== "全部定位" && build.role !== selectedRole) {
        return false;
      }

      // 3. Tier filter
      if (selectedTier !== "全部 Tier" && build.tier !== selectedTier) {
        return false;
      }

      // 4. Core gear unlocked toggle
      const { isCoreFullyUnlocked } = getBuildGearStats(build);
      if (onlyCoreUnlocked && !isCoreFullyUnlocked) {
        return false;
      }

      // 5. Search text query match
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = build.name.toLowerCase().includes(query);
        const matchesSubclass = build.subclass.toLowerCase().includes(query);
        const matchesClass = build.mainClass.toLowerCase().includes(query);
        const matchesGear = Object.values(build.equipment).some(item => 
          item.displayName.toLowerCase().includes(query) || 
          item.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSubclass && !matchesClass && !matchesGear) {
          return false;
        }
      }

      return true;
    });
  }, [selectedClass, selectedRole, selectedTier, onlyCoreUnlocked, searchQuery, checkedRegions]);

  // Ensure selected build stays valid when filtering
  React.useEffect(() => {
    if (filteredBuilds.length > 0 && !filteredBuilds.some(b => b.id === selectedBuildId)) {
      setSelectedBuildId(filteredBuilds[0].id);
    }
  }, [filteredBuilds, selectedBuildId]);

  // Open BG3 Wiki in new tab
  const openBg3Wiki = (itemName) => {
    const formattedName = encodeURIComponent(itemName.replace(/ /g, '_'));
    window.open(`https://bg3.wiki/wiki/${formattedName}`, '_blank', 'noopener,noreferrer');
  };

  const activeStats = getBuildGearStats(activeBuild);

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Accent Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/80 to-[#0d0f14] pointer-events-none z-0" />
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="relative z-10 border-b border-[#332a1d] bg-[#12151e]/90 backdrop-blur-md sticky top-0 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-300/40">
              <Swords className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-wide text-amber-200 font-serif flex items-center gap-2">
                博德之门3 全职业子职流派构筑与装备探索器
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-sans hidden sm:inline-block">
                  46个子职业全覆盖
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                点亮已探索地图，即时匹配 T0~T3 核心装备齐备状态与 11 槽位 Paperdoll 跳转
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative w-40 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索装备 / 职业 / 子职业..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1b1f2b] border border-slate-700/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* ================= MAIN CONTAINER LAYOUT ================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================================================== */}
        {/* LEFT COLUMN: REGION CHECKLIST (4 COLS)               */}
        {/* ==================================================== */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-[#151822]/90 rounded-xl border border-[#332b1f] p-4 shadow-xl backdrop-blur-sm">
            
            {/* Header & Stats */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif font-bold text-amber-100 text-base">地图区域解锁进度</h2>
              </div>
              <div className="text-xs text-amber-400 font-mono">
                已点亮 {checkedRegions.size} 个区域
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="py-3 flex flex-wrap gap-1.5 border-b border-slate-800/80 text-xs">
              <button 
                onClick={() => selectAllAct(1)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-900/40 text-slate-300 hover:text-amber-200 border border-slate-700 transition"
              >
                + 第一幕全选
              </button>
              <button 
                onClick={() => selectAllAct(2)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-900/40 text-slate-300 hover:text-amber-200 border border-slate-700 transition"
              >
                + 第二幕全选
              </button>
              <button 
                onClick={() => selectAllAct(3)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-900/40 text-slate-300 hover:text-amber-200 border border-slate-700 transition"
              >
                + 第三幕全选
              </button>
              <button 
                onClick={selectAllRegions}
                className="px-2 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/40 transition"
              >
                全部勾选
              </button>
              <button 
                onClick={clearAllRegions}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 border border-slate-700 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> 重置
              </button>
            </div>

            {/* Regions List categorized by Act */}
            <div className="mt-3 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
              {ACT_REGIONS.map(act => {
                const actCheckedCount = act.regions.filter(r => checkedRegions.has(r.id)).length;
                return (
                  <div key={act.act} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1 pt-1">
                      <span className="text-amber-400/90 font-serif">{act.actTitle}</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {actCheckedCount} / {act.regions.length}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {act.regions.map(region => {
                        const isChecked = checkedRegions.has(region.id);
                        return (
                          <div 
                            key={region.id}
                            onClick={() => toggleRegion(region.id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs border transition-all duration-150 ${
                              isChecked 
                                ? 'bg-amber-950/25 border-amber-600/50 text-amber-100 shadow-sm' 
                                : 'bg-[#1a1d28]/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-600 shrink-0" />
                              )}
                              <div>
                                <span className={`font-medium ${isChecked ? 'text-amber-200' : 'text-slate-300'}`}>
                                  {region.name}
                                </span>
                                <span className="block text-[10px] text-slate-500 leading-none mt-0.5">
                                  {region.sub}
                                </span>
                              </div>
                            </div>
                            
                            {isChecked && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </aside>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: BUILDS + PAPERDOLL (8 COLS)            */}
        {/* ==================================================== */}
        <section className="lg:col-span-8 space-y-5">
          
          {/* MULTI-FILTERING CONTROLS PANEL */}
          <div className="bg-[#151822]/90 rounded-xl border border-[#332b1f] p-4 shadow-xl backdrop-blur-sm space-y-3.5">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <h2 className="font-serif font-bold text-amber-100 text-sm">流派多维度筛选 (共 46 个子职业)</h2>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                符合条件: <span className="text-amber-300 font-bold">{filteredBuilds.length}</span> 个构筑
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              
              {/* Class Filter */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">12 主职业划分:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-[#1b1f2b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {MAIN_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">战斗/团队定位:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-[#1b1f2b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {ROLES_LIST.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Tier Filter */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">强度 Tier 分级:</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full bg-[#1b1f2b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {TIERS_LIST.map(tier => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Core Gear Filter Toggle Checkbox */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <label 
                onClick={() => setOnlyCoreUnlocked(!onlyCoreUnlocked)}
                className="flex items-center space-x-2 cursor-pointer select-none text-amber-200 font-medium"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                  onlyCoreUnlocked 
                    ? 'bg-amber-500 border-amber-400 text-slate-950' 
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  {onlyCoreUnlocked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  仅显示【核心装备】已全部可获取的构筑
                </span>
              </label>

              {(selectedClass !== "全部职业" || selectedRole !== "全部定位" || selectedTier !== "全部 Tier" || onlyCoreUnlocked || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedClass("全部职业");
                    setSelectedRole("全部定位");
                    setSelectedTier("全部 Tier");
                    setOnlyCoreUnlocked(false);
                    setSearchQuery("");
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  清空筛选条件
                </button>
              )}
            </div>

            {/* Build Cards Grid Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredBuilds.map(build => {
                const isSelected = build.id === selectedBuildId;
                const { unlockedCount, total, percentage, coreTotal, coreUnlocked, isCoreFullyUnlocked } = getBuildGearStats(build);
                
                return (
                  <button
                    key={build.id}
                    onClick={() => setSelectedBuildId(build.id)}
                    className={`p-2.5 rounded-lg text-left border transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/50' 
                        : 'bg-[#1b1f2b]/80 border-slate-800 hover:border-slate-700 hover:bg-[#202535]'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-base">{build.icon}</span>
                        
                        <div className="flex items-center space-x-1">
                          {/* Tier Badge */}
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${getTierBadgeStyle(build.tier)}`}>
                            {build.tier}
                          </span>

                          {/* Core Equipment Indicator Badge */}
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${
                            isCoreFullyUnlocked 
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
                              : 'bg-rose-950/80 text-rose-300 border-rose-900/50'
                          }`}>
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {coreUnlocked}/{coreTotal} 核心
                          </span>
                        </div>
                      </div>
                      
                      {/* Title & Subclass */}
                      <h3 className={`font-serif text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                        {build.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {build.mainClass} · {build.subclass}
                      </p>
                    </div>

                    {/* Unlock Percentage Bar */}
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">装备进度 {unlockedCount}/{total}</span>
                      <span className="font-mono text-amber-400 font-bold">{percentage}%</span>
                    </div>
                  </button>
                );
              })}

              {filteredBuilds.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400 text-xs space-y-1">
                  <p className="text-amber-400 font-semibold">未匹配到相关构筑</p>
                  <p>请尝试关闭“核心装备已解锁”限制或重置搜索条件。</p>
                </div>
              )}
            </div>

          </div>

          {/* ACTIVE BUILD MAIN DISPLAY PANEL */}
          <div className="bg-[#151822]/90 rounded-xl border border-[#332b1f] shadow-xl backdrop-blur-sm overflow-hidden">
            
            {/* Active Build Header */}
            <div className="p-5 border-b border-[#332b1f] bg-gradient-to-r from-[#1c1a16] via-[#161923] to-[#12151e]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span className="text-2xl">{activeBuild.icon}</span>
                    <h2 className="text-xl font-serif font-bold text-amber-200 tracking-wide">
                      {activeBuild.name}
                    </h2>
                    
                    <span className={`text-xs px-2 py-0.5 rounded border ${getTierBadgeStyle(activeBuild.tier)}`}>
                      {activeBuild.tier} 评级
                    </span>

                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {activeBuild.mainClass} · {activeBuild.subclass}
                    </span>

                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-900/40">
                      定位: {activeBuild.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {activeBuild.summary}
                  </p>
                </div>

                {/* Overall Unlock Status */}
                <div className="shrink-0 bg-[#0d0f15]/80 p-3 rounded-lg border border-amber-900/40 text-right min-w-[170px]">
                  <div className="text-[11px] text-slate-400">全装备解封度</div>
                  <div className="text-lg font-bold font-mono text-amber-300">
                    {activeStats.unlockedCount} / {activeStats.total} <span className="text-xs font-sans text-amber-500">({activeStats.percentage}%)</span>
                  </div>
                  
                  {/* Core Status Tag */}
                  <div className="mt-1">
                    {activeStats.isCoreFullyUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 核心装备已齐全 ({activeStats.coreUnlocked}/{activeStats.coreTotal})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
                        <Lock className="w-3 h-3 text-rose-400" /> 缺少核心装备 ({activeStats.coreUnlocked}/{activeStats.coreTotal})
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* MODE SWITCH TABS */}
              <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setActiveTab("paperdoll")}
                  className={`px-4 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                    activeTab === "paperdoll" 
                      ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm' 
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  全身装备姿态 (11槽位 Paperdoll View)
                </button>
                <button
                  onClick={() => setActiveTab("strategy")}
                  className={`px-4 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                    activeTab === "strategy" 
                      ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm' 
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  兼职加点与战术手法
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: PAPERDOLL EQUIPMENT GRID */}
            {activeTab === "paperdoll" && (
              <div className="p-5">
                
                <div className="mb-3.5 flex items-center justify-between text-xs text-slate-400 bg-amber-950/15 p-2.5 rounded-lg border border-amber-900/30">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>标识 <span className="text-amber-300 font-bold">⭐ 核心装备</span> 为该流派机制运转的决定性装备；点击条目可跳转至 <strong>BG3 Wiki</strong> 官方页面。</span>
                  </div>
                </div>

                {/* 11 Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(SLOT_INFO).map(([slotKey, info]) => {
                    const item = activeBuild.equipment[slotKey];
                    if (!item) return null;

                    const isUnlocked = checkedRegions.has(item.regionId);
                    const rarityStyle = getRarityStyle(item.rarity);

                    return (
                      <div 
                        key={slotKey}
                        onClick={() => openBg3Wiki(item.name)}
                        className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow} hover:scale-[1.01] hover:border-amber-400`}
                      >
                        {/* Status Badge & Core Tag Top Right */}
                        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5">
                          {item.isCore && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold shadow-sm">
                              <Star className="w-3 h-3 fill-slate-950" />
                              核心装备
                            </span>
                          )}

                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              已解锁
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-400 border border-slate-700 font-medium">
                              <Lock className="w-3 h-3 text-slate-500" />
                              未探索
                            </span>
                          )}
                        </div>

                        {/* Slot Icon & Names */}
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-md border flex items-center justify-center text-lg shrink-0 bg-slate-950/60 ${rarityStyle.border}`}>
                            {info.icon}
                          </div>
                          
                          <div className="pr-20 space-y-0.5">
                            <div className="text-[10px] text-slate-400 font-semibold tracking-wider">
                              {info.name}
                            </div>
                            
                            <h4 className={`text-xs font-bold font-serif group-hover:text-amber-200 transition ${rarityStyle.text}`}>
                              {item.displayName}
                            </h4>
                            
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {item.name}
                            </div>
                          </div>
                        </div>

                        {/* Location Details Footer */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center space-x-1 truncate pr-2">
                            <span className="text-amber-400/80">📍</span>
                            <span className="truncate">{item.location}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 transition shrink-0" />
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: STRATEGY & LEVELING BREAKDOWN */}
            {activeTab === "strategy" && (
              <div className="p-5 space-y-6">
                
                {/* Multiclass Leveling Route */}
                <div>
                  <h3 className="text-sm font-bold font-serif text-amber-200 mb-2 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-amber-400" />
                    推荐兼职等级路线 (Multiclass Build)
                  </h3>
                  <div className="bg-[#1b1f2b] p-3 rounded-lg border border-slate-800 text-xs font-mono font-bold text-amber-300">
                    {activeBuild.multiclass}
                  </div>
                </div>

                {/* Attributes Priority */}
                <div>
                  <h3 className="text-sm font-bold font-serif text-amber-200 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    核心属性加点建议 (Ability Scores)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                    {Object.entries(activeBuild.attributes).map(([attr, val]) => (
                      <div key={attr} className="bg-[#1b1f2b] p-2.5 rounded-lg border border-slate-800">
                        <div className="text-xs font-mono font-bold text-amber-400">{attr}</div>
                        <div className="text-xs font-semibold text-slate-200 mt-1">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Feats */}
                <div>
                  <h3 className="text-sm font-bold font-serif text-amber-200 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    推荐关键专长 (Key Feats)
                  </h3>
                  <ul className="space-y-2">
                    {activeBuild.feats.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-300 bg-[#1b1f2b] p-2.5 rounded-lg border border-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Combat Tactics & Rotation */}
                <div>
                  <h3 className="text-sm font-bold font-serif text-amber-200 mb-3 flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-amber-400" />
                    流派核心 Combo 与战斗手法
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    {activeBuild.strategy.map((step, idx) => (
                      <div key={idx} className="p-3 bg-[#1b1f2b] rounded-lg border border-slate-800 leading-relaxed flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-center leading-5 shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Core Items Roadmap */}
                <div>
                  <h3 className="text-sm font-bold font-serif text-amber-200 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    未获取装备获取路线指南
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(activeBuild.equipment)
                      .filter(([_, item]) => !checkedRegions.has(item.regionId))
                      .map(([slotKey, item]) => (
                        <div key={slotKey} className="flex items-center justify-between p-2.5 bg-rose-950/10 border border-rose-900/30 rounded-lg text-xs">
                          <div className="flex items-center space-x-2">
                            {item.isCore ? (
                              <span className="text-amber-400 font-bold flex items-center gap-0.5">⭐ [核心]</span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span className="font-semibold text-rose-200">{item.displayName}</span>
                            <span className="text-slate-400 text-[11px]">({SLOT_INFO[slotKey]?.name})</span>
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            需要前往: <span className="text-amber-300">{item.location}</span>
                          </div>
                        </div>
                      ))}
                    
                    {Object.entries(activeBuild.equipment).every(([_, item]) => checkedRegions.has(item.regionId)) && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 text-center font-medium">
                        🎉 恭喜！当前构筑所需的所有核心及扩展装备均已在您的探索地图中解锁！
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-[#332b1f] bg-[#0d0f14] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif text-slate-400">Baldur's Gate 3 Full 46 Subclasses Build & Gear Explorer</p>
          <p className="mt-1 text-[11px]">
            数据与装备链接均同步至 <a href="https://bg3.wiki" target="_blank" rel="noreferrer" className="text-amber-400 underline hover:text-amber-300">BG3 Official Wiki</a> 页面。
          </p>
        </div>
      </footer>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 17, 21, 0.6);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #332b1f;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4af37;
        }
      `}</style>
    </div>
  );
}