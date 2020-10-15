import React from 'react';
import {useEffect, useState, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Card} from 'react-native-elements';
import {Container,Content, CardItem, Left, Body , Button} from 'native-base'
import { WebView } from 'react-native-webview';
import nutriData from './nutridata';
import HTMLView from 'react-native-htmlview';

// const rows = 3;
// const cols = 2;
const marginHorizontal = 4;
const marginVertical = 8;

let foodNameArray = new Array(); //食品名を格納する配列
let foodUrlArray = new Array(); //各食品のURLを格納する配列
let categoryIdArray = new Array(); //食品のカテゴリーIDを格納する配列
let foodImageUrlArray = new Array();
let foodTitleArray = new Array();
let foodDescriptionArray = new Array();
let recipeUrlArray = new Array();

var id;
var url;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#FFCC66",
  },
  subTitle: {
    color: "white",
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Title: {
    color: "white",
    fontSize: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    height: 250,
  },
  startButton: {
    backgroundColor: "white",
    alignSelf: "center",
    textAlignVertical: "center",
    width: 300,
    height: 300,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 40,
    fontWeight: "bold",
    color: '#333333'
  },
  scrolleContainer: {
    flex: 1,
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    marginTop: marginVertical,
    marginBottom: marginVertical,
    marginLeft: marginHorizontal,
    marginRight: marginHorizontal,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 4,
      height: 5
    },
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#FF8C00'
  },
  nutritionButton: {
    width: 300,
    height: 130,
    backgroundColor: 'white',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#FF8C00',
    paddingBottom: 10
  },
  card: {
    width: 400,
    height: 1000
  },
  credit:{
    alignSelf: 'center'
  }
})

function HomeScreen({ navigation }) {

  const [foodNameState, setfoodNameState] = useState([])
  const [foodUrlState, setfoodUrlState] = useState([])
  const [categoryIdState, setCategoryIdState] = useState([])
  const [nutriState, setNutriState] = useState(nutriData)
  const credit = `<a href="https://webservice.rakuten.co.jp/" target="_blank"><img src="https://webservice.rakuten.co.jp/img/credit/200709/credit_31130.gif" border="0" alt="楽天ウェブサービスセンター" title="楽天ウェブサービスセンター" width="311" height="30"/></a>`

  useEffect(() => {
    fetch('https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&categoryType=small&applicationId=1056849094603831237')
    .then((response) => {
      const recipe = response.json()
      return recipe;
    })
    .then((recipe) => {
      const resultSmallArray = recipe.result.small 
      for (let index = 0; index < resultSmallArray.length; index++) {
        const categoryId = resultSmallArray[index].categoryUrl.split('/');
        categoryIdArray.push(categoryId[4]);
        foodUrlArray.push(resultSmallArray[index].categoryUrl)
      }
      setfoodUrlState(foodUrlArray)
      setCategoryIdState(categoryIdArray)
    })
    .catch(function(error) {
      
    }), []})

      useEffect(() => {
        fetch('https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&categoryType=small&applicationId=1056849094603831237')
        .then((response) => {
          const recipe = response.json()
          return recipe
        })
        .then((recipe) => {
          const resultSmallArray = recipe.result.small 
          for (let index = 0; index < resultSmallArray.length; index++) {
            foodNameArray.push(resultSmallArray[index].categoryName)
          }
          setfoodNameState(foodNameArray)
        })
        .catch(function(error) {
        }), []})


  return (
    <View style={styles.container}>
    <Text style={styles.subTitle}>あなたのための栄養素</Text>
    <Text style={styles.Title}>Nutri</Text>
    <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Symptom', {categoryIdState: categoryIdState, foodNameState: foodNameState, foodUrlState: foodUrlState, nutriState: nutriState})}>
      <Text style={styles.buttonText}>タップして</Text>
      <Text style={styles.buttonText}>はじめる！</Text>
    </TouchableOpacity>
    <View style={{padding: 10}}/>
    <HTMLView value={credit} style={styles.credit}/>
    </View>
  );
}

function SymptomScreen({route, navigation}) {
  const { categoryIdState } = route.params;
  const { foodNameState } = route.params;
  const { foodUrlState } = route.params;
  const { nutriState } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.sectionContainer}>
        {renderSymptomButton(navigation, categoryIdState, foodNameState, foodUrlState, nutriState)}
      </View>
      </ScrollView>
      </SafeAreaView>
  );
}

function NutrientsScreen({route, navigation}) {
  const { symptomName } = route.params;
  const { nutriState } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderNutrientsButton(navigation, symptomName, nutriState)}
      </ScrollView>
      </SafeAreaView>
  );
}

function NutrientsDetailsScreen({route, navigation}) {
  const { nutrient } = route.params;
  const { nutriState } = route.params;

  let descriptionData;
  for (const key in nutriState['description']) {
    const content = nutriState['description'][key]
    if(key === nutrient){
      descriptionData = content
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card containerStyle={{height: 700, borderStyle: 'solid', borderWidth: 1, borderColor: '#FF8C00'}}>
          <Card.Title titleStyle={{height: 200}}>
            <Text style={{fontSize: 40, color: '#8B4513'}}>{nutrient}</Text>
          </Card.Title>
          <Card.Divider/>
            <Text style={{marginBottom: 10, fontSize: 25, letterSpacing: 5, color: '#8B4513'}}>
              {descriptionData}
            </Text>
            <View style={{padding: 20}}></View>
            <View style={{padding: 20}}/>
            <TouchableOpacity onPress={() => navigation.navigate('Food', {nutrient: nutrient, nutriState: nutriState})}　style={{borderRadius: 60, marginLeft: 0, marginRight: 0, marginBottom: 0, height: 120, backgroundColor: '#FFDEAD', borderStyle: 'solid', borderColor: '#8B4513',borderWidth: 1}}>
              <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: '#8B4513',marginTop: 30, marginLeft: 'auto', marginRight: 'auto'}}>上記の栄養素が</Text>
              <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: '#8B4513',marginTop: 7, marginLeft: 'auto', marginRight: 'auto'}}>含まれている食べ物をみる</Text>
            </TouchableOpacity>
            <View style={{padding: 10}}/>
            <TouchableOpacity onPress={() => navigation.navigate('Nutrients')} style={{borderRadius: 60, marginLeft: 0, marginRight: 0, marginBottom: 0, height: 120, backgroundColor: '#FFFAF0', borderStyle: 'solid', borderColor: '#8B4513',borderWidth: 1}}>
              <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: '#8B4513',marginTop: 50, marginLeft: 'auto', marginRight: 'auto'}}>栄養素一覧に戻る</Text>
            </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

function FoodScreen({route, navigation}) {

  const { nutrient } = route.params;
  const { nutriState } = route.params;

  return (
    <Container style={styles.container}>
      <Content>
      <ScrollView>
        {renderFoodButtons(navigation, nutrient, nutriState)}
      </ScrollView>
      </Content>
    </Container>
  );
}


function CookingMenuScreen({route, navigation}) {

  const { food } = route.params;

  fetchRakutenAPI(food)
  

  return (
    <Container style={styles.container}>
      <Content>
      <ScrollView>
        {renderCookingMenuCards(navigation)}
      </ScrollView>
      </Content>
    </Container>
  )
}

function WebScreen({route, navigation}) {

  const { key } = route.params;
  const {recipeUrlArray} = route.params;

  return (
    <Container>
    <WebView
        // source={{uri: recipeUrlArray[key]}}
        source={{uri: recipeUrlArray[key]}}
        style={{marginTop: 20}}
        scalesPageToFit={true}
      />
    </Container>
  )
}


function renderSymptomButton(navigation, categoryIdState, foodNameState, foodUrlState, nutriState) {
  const symptomArray = [
    {
      name: '目の疲れ'
    },
    {
      name: '肩こり'
    },
    {
      name: '肌荒れ'
    },
    {
      name: '口内炎'
    },
    {
      name: 'かぜ'
    },
    {
      name: '貧血'
    }
  ]

  return symptomArray.map((symptom, key) => {
    const symptomName = symptom.name
    return (
      <View key={'symptomView'+key}>
      <TouchableOpacity onPress={() => navigation.navigate('Nutrients', {symptomName: symptomName, nutriState: nutriState})} style={styles.boxContainer} key={'symptomTouchableOpacity'+key}>
        <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold', color: '#8B4513',}} key={'symptomText'+key}>{symptom.name}</Text>
      </TouchableOpacity>
      <View style={{padding: 5}} key={'symptomViewForPadding' + key}></View>
      </View>
    );
  });
}

function renderNutrientsButton(navigation, symptomName, nutriState) {

  let nutriData;
  let nutriDataArray = new Array()
  for (const key in nutriState['symptom']) {
    const content = nutriState['symptom'][key]
    if(key === symptomName){
      nutriData = content
      nutriDataArray.push(nutriData)
    }
  }

  const nutrientsArray = new Array()
  for (let index = 0; index < nutriDataArray[0].length; index++) {
    const element = nutriDataArray[0][index];
    nutrientsArray.push(element)
  }

  return nutrientsArray.map((nutrient, key) => {
    return (
      <View style={{paddingBottom: 15}} key={'nutrientsView' + key}>
      <TouchableOpacity onPress={() => navigation.navigate('NutrientsDetails', {nutrient: nutrient, nutriState: nutriState})} style={styles.nutritionButton} key={'nutrientsTouchableOpacity' + key}>
        <Text style={{textAlign: 'center', fontSize: 35, fontWeight: 'bold', color: '#8B4513',marginTop: 50, marginLeft: 'auto', marginRight: 'auto'}} key={'nutrientsText' + key}>{nutrient}</Text>
      </TouchableOpacity>
      </View>
    );
  });

}

async function fetchRakutenAPI(food){

  let foodImageUrl = new Array();
  let foodTitle = new Array();
  let foodDescription = new Array();
  let recipeUrl = new Array();
  const [foodImageUrlState, setstate] = useState([])
  const [foodTitleState, setFoodTitleState] = useState([])
  const [foodDescriptionState, setFoodDescriptionState] = useState([])
  const [recipeState, setRecipeState] = useState([])


  for (let index = 0; index < foodNameArray.length; index++) {
    if (foodNameArray[index] === food) {
      id = categoryIdArray[index]
      url = "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&categoryId="+id+"&applicationId=1056849094603831237"
    }
  }

  fetch(url)
  .then(response => {
    const recipe = response.json();
    return recipe
  })
  .then(recipe => {
    for (let index = 0; index < Object.keys(recipe.result).length; index++) {
      foodImageUrl.push(recipe.result[index].mediumImageUrl.toString())
      foodTitle.push(recipe.result[index].recipeTitle.toString())
      foodDescription.push(recipe.result[index].recipeDescription.toString())
      recipeUrl.push(recipe.result[index].recipeUrl.toString())
    };
    foodImageUrlArray = foodImageUrl;
    foodTitleArray = foodTitle;
    foodDescriptionArray = foodDescription;
    recipeUrlArray = recipeUrl;
    (() => {
      setstate(foodImageUrl);
      setFoodTitleState(foodTitle)
      setFoodDescriptionState(foodDescription)
      setRecipeState(recipeUrl)
      foodImageUrlArray = foodImageUrlState;
      foodTitleArray = foodTitleState;
      foodDescriptionArray = foodDescriptionState;
      recipeUrlArray = recipeState;
    })();
  })
  .catch((error) => {
    console.log(error)
  })

}

function renderFoodButtons(navigation, nutrient, nutriState) {

  let foodData;
  let foodDataArray = new Array()
  for (const key in nutriState['nutrients']) {
    const content = nutriState['nutrients'][key]
    if(key === nutrient){
      foodData = content
      foodDataArray.push(foodData)
    }
  }

  const foodsArray = new Array()
  for (let index = 0; index < foodDataArray[0].length; index++) {
    const element = foodDataArray[0][index];
    foodsArray.push(element)
  }

  return foodsArray.map((food, key) => {
      return (
        <View style={{paddingBottom: 15}} key={'foodView' + key}>
        <TouchableOpacity onPress={() => navigation.navigate('CookingMenu', {food: food})} style={styles.nutritionButton} key={'foodTouchableOpacity' + key}>
          <Text style={{textAlign: 'center', fontSize: 35, fontWeight: 'normal', color: '#8B4513',marginTop: 50, marginLeft: 'auto', marginRight: 'auto'}} key={'foodText' + key}>{food}</Text>
        </TouchableOpacity>
        </View>
      );
  });
}

function renderCookingMenuCards(navigation) {

  const CookingMenu = [
    {
       recipeTitle: foodTitleArray[0],
      foodImageUrl: foodImageUrlArray[0],
       recipeDescription: foodDescriptionArray[0]
    },
    {
      recipeTitle: foodTitleArray[1],
      foodImageUrl: foodImageUrlArray[1],
      recipeDescription: foodDescriptionArray[1]
    },
    {
      recipeTitle: foodTitleArray[2],
      foodImageUrl: foodImageUrlArray[2],
      recipeDescription: foodDescriptionArray[2]
    },
    {
      recipeTitle: foodTitleArray[3],
      foodImageUrl: foodImageUrlArray[3],
      recipeDescription: foodDescriptionArray[3]
    },
  ]

  return CookingMenu.map((menu, key) => {
    return (
      <Card style={{flex: 0}} containerStyle={{borderRadius: 50}} key={'CookingMenuCard' + key}>
        <CardItem key={'CookingMenuCardItem1' + key}>
          <Left key={'CookingMenuLeft' + key}>
            <Body key={'CookingMenuBody1' + key}>
              <Text style={{textAlign: 'center', fontSize: 35, fontWeight: 'normal', color: '#8B4513'}} key={'CookingMenuRecipeTitle' + key}>{menu.recipeTitle}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem style={{display: 'flex'}} key={'CookingMenuCardItem2' + key}>
          <Body key={'CookingMenuBody2' + key}>
            <Image source={{uri: menu.foodImageUrl}} style={{height: 140, width: 140, flex: 1}}/>
          </Body>
          <Body key={'CookingMenuBody3' + key}>
            <Text style={{fontSize: 20, fontWeight: 'normal', color: '#8B4513', padding: 5}} key={'CookingMenuRecipeDescription' + key}>
              {menu.recipeDescription}
            </Text>
          </Body>
        </CardItem>
        <Body key={'CookingMenuBody4' + key}>
          <Button onPress={() => navigation.navigate('Web', {key: key, recipeUrlArray: recipeUrlArray})} style={{backgroundColor: '#FFDEAD', width: 200, justifyContent: 'center'}} key={'CookingMenuButton' + key}>
            <Text key={'CookingMenuHowToCook' + key} style={{fontSize: 20, fontWeight: 'bold', color: '#8B4513'}}>作り方を見る</Text>
          </Button>
        </Body>
    </Card>
    );
  });
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:'', headerStyle: {backgroundColor: '#FFCC66',},headerTintColor: '#fff',  headerBackTitleVisible: false, headerTintColor: '#FFCC66'}} />
        <Stack.Screen name="Symptom" component={SymptomScreen} options={{title:'いまの症状を選択', headerStyle: {backgroundColor: '#FFCC66'},headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold', color: 'white', fontSize: 30}, headerBackTitleVisible: false, }}/>
        <Stack.Screen name="Nutrients" component={NutrientsScreen} options={{title:'必要な栄養素', headerStyle: {backgroundColor: '#FFCC66'},headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold', color: 'white', fontSize: 30}, headerBackTitleVisible: false, }} />
        <Stack.Screen name="NutrientsDetails" component={NutrientsDetailsScreen} options={{title:'栄養素の詳細', headerStyle: {backgroundColor: '#FFCC66'},headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold', color: 'white', fontSize: 30}, headerBackTitleVisible: false, }} />
        <Stack.Screen name="Food" component={FoodScreen} options={{title:'栄養素を含む食べ物', headerStyle: {backgroundColor: '#FFCC66'},headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold', color: 'white', fontSize: 30}, headerBackTitleVisible: false, }} />
        <Stack.Screen name="CookingMenu" component={CookingMenuScreen} options={{title:'料理一覧', headerStyle: {backgroundColor: '#FFCC66'},headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold', color: 'white', fontSize: 30}, headerBackTitleVisible: false, }} />
        <Stack.Screen name="Web" component={WebScreen} options={{title:'料理の作り方', headerStyle: {backgroundColor: '#FFCC66'},headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold', color: 'white', fontSize: 30}, headerBackTitleVisible: false, }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;