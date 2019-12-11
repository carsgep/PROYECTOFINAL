import base64
import os

import dash
from dash.dependencies import Input, Output, State
import dash_core_components as dcc
import dash_html_components as html
import dash_daq as daq
import pandas as pd
import plotly.graph_objects as go
import json
import os
import datetime
import seaborn as sns
import matplotlib.pyplot as plt
import dfply
from dfply import*
from sodapy import Socrata
from sqlalchemy import create_engine

from dash_bio_utils import gene_expression_reader
import dash_bio

#engine = create_engine('postgresql://viouser:T34m10*@violence.cl09f9utzefm.us-east-2.rds.amazonaws.com/violence')
#df = pd.read_sql("SELECT * from target", engine.connect(), parse_dates=['Fecha'])
dfnna2018=pd.read_csv('data/NNA/nna2018.csv')
poblacion=pd.read_csv('data/poblacionpordepartamento.csv')
dfnna2017=pd.read_csv('data/NNA/nna2017.csv')
dfnna2016=pd.read_csv('data/NNA/nna2016.csv')
dfnna2017['año']='2017'
dfnna2018['año']='2018'
dfnna2016['año']='2016'
dfnna2018=dfnna2018[['Municipio','casosm','casosh','año']]
dfnna2017=dfnna2017[['Municipio','casosm','casosh','año']]
dfnna2016=dfnna2016[['Municipio','casosm','casosh','año']]
dfallnna=pd.concat([dfnna2016,dfnna2017,dfnna2018] , axis=0, ignore_index=True)
dfallnna=dfallnna.drop_duplicates()
dfallnna['rango']='NNA'

dfold2018=pd.read_csv('data/OLD/old2018.csv')
dfold2017=pd.read_csv('data/OLD/old2017.csv')
dfold2016=pd.read_csv('data/OLD/old2016.csv')
dfold2018['año']='2018'
dfold2017['año']='2017'
dfold2016['año']='2016'
dfold2018=dfold2018[['Municipio','casosm','casosh','año']]
dfold2017=dfold2017[['Municipio','casosm','casosh','año']]
dfold2016=dfold2016[['Municipio','casosm','casosh','año']]
dfallold=pd.concat([dfold2016,dfold2017,dfold2018] , axis=0, ignore_index=True)
dfallold=dfallold.drop_duplicates()
dfallold['rango']='OLD'

dfoth2018=pd.read_csv('data/OTHERS/others2018.csv')
dfoth2017=pd.read_csv('data/OTHERS/others2017.csv')
dfoth2016=pd.read_csv('data/OTHERS/others2016.csv')
dfoth2018['año']='2018'
dfoth2017['año']='2017'
dfoth2016['año']='2016'
dfoth2018=dfoth2018[['Municipio','casosm','casosh','año']]
dfoth2017=dfoth2017[['Municipio','casosm','casosh','año']]
dfoth2016=dfoth2016[['Municipio','casosm','casosh','año']]
dfalloth=pd.concat([dfoth2016,dfoth2017,dfoth2018] , axis=0, ignore_index=True)
dfalloth['rango']='OTH'
dfalloth=dfalloth.drop_duplicates()

dfpar2018=pd.read_csv('data/PAREJA/pareja2018.csv')
dfpar2017=pd.read_csv('data/PAREJA/pareja2017.csv')
dfpar2016=pd.read_csv('data/PAREJA/pareja2016.csv')
dfpar2018['año']='2018'
dfpar2017['año']='2017'
dfpar2016['año']='2016'
dfpar2018=dfpar2018[['Municipio','casosm','casosh','año']]
dfpar2017=dfpar2017[['Municipio','casosm','casosh','año']]
dfpar2016=dfpar2016[['Municipio','casosm','casosh','año']]
dfallpar=pd.concat([dfpar2016,dfpar2017,dfpar2018] , axis=0, ignore_index=True)
dfallpar['rango']='PAR'
dfallpar=dfallpar.drop_duplicates()


def calctasas(df1):
    dfret=df1.copy()
    poblacion['Mun_corrected'] = poblacion['Municipio'].map(col_state_abbrev)
    dfret=dfret.merge(poblacion, on='Mun_corrected')
    dfret['casosm'] =dfret['casosm'].astype(int)
    dfret['casosh'] =dfret['casosh'].astype(int)
    dfret['tasah']=(dfret['casosh']/(dfret['Poblacion']/200000)).astype(int)
    dfret['tasam']=(dfret['casosm']/(dfret['Poblacion']/200000)).astype(int)
    dfret['total']=dfret['casosm']+dfret['casosh']
    dfret['tasat']=(dfret['total']/(dfret['Poblacion']/100000)).astype(int)
    return dfret

def calculate_bar(df,dpto):
     data = []
     dff = df.copy()
     dff['YEAR'] =dff['Fecha'].dt.to_period('Y').dt.strftime('%Y')
     by_date = dff >> group_by(X.YEAR) >> summarize(Cases = X.Fecha.count())
     #sns.lineplot(x = 'Fecha', y = 'Cases', data = by_date, palette='viridis')
     if states:
        dff = dff[(df['State_abbr'].isin(states))]
        
     if  start_date and end_date:
        dff = dff[(df['Fecha'] >= start_date) & (df['Fecha'] <= end_date)]

    #subcategory_grouped = dff.groupby(['Category'], as_index=False)
    #for name, group in subcategory_grouped:
     #   grouped = group.groupby('YearMonth', as_index=False).sum()
     data.append(go.Bar(
        x=by_date['YEAR'], y=by_date['Cases'],marker=dict(color='#FFBF00')))
  
    
     return data




col_state_abbrev = {
    'ANTIOQUIA': 'ANTIOQUIA',
    'ATLÁNTICO': 'ATLANTICO',
    'SANTAFE DE BOGOTA D.C': 'SANTAFE DE BOGOTA D.C',
    'BOLÍVAR': 'BOLIVAR',
    'BOYACÁ': 'BOYACA',
    'CALDAS': 'CALDAS',
    'CAQUETÁ': 'CAQUETA',
    'CAUCA': 'CAUCA',
    'CESAR': 'CESAR',
    'CÓRDOBA': 'CORDOBA',
    'CUNDINAMARCA': 'CUNDINAMARCA',
    'CHOCÓ': 'CHOCO',
    'HUILA': 'HUILA',
    'GUAJIRA': 'LA GUAJIRA',
    'MAGDALENA': 'MADGALENA',
    'META': 'META',
    'NARIÑO': 'NARIÑO',
    'QUINDÍO': 'QUINDIO',
    'RISARALDA': 'RISARALDA',
    'SANTANDER': 'SANTANDER',
    'SUCRE': 'SUCRE',
    'VALLE': 'VALLE DEL CAUCA',
    'ARAUCA': 'ARAUCA',
    'CASANARE': 'CASANARE',
    'PUTUMAYO': 'PUTUMAYO',
    'AMAZONAS': 'AMAZONAS',
    'GUAINÍA': 'GUAINIA',
    'GUAVIARE': 'GUAVIARE',
    'VAUPÉS': 'VAUPES',
    'VICHADA': 'VICHADA',
    'SAN ANDRÉS': 'SAN ANDRES',
    'NORTE DE SANTANDER': 'NORTE DE SANTANDER',
    'TOLIMA': 'TOLIMA',
    
}




#states_grouped=states_grouped.sort_values(by='Poblacion',ascending=False)




token = 'pk.eyJ1IjoibmV3dXNlcmZvcmV2ZXIiLCJhIjoiY2o2M3d1dTZiMGZobzMzbnp2Z2NiN3lmdyJ9.cQFKe3F3ovbfxTsM9E0ZSQ'
with open('colombia2.json') as f:
    geojson = json.loads(f.read())


# running directly with Python
if __name__ == '__main__':
    from utils.app_standalone import run_standalone_app

# running with gunicorn (on servers)
elif 'DASH_PATH_ROUTING' in os.environ:
    from utils.app_standalone import run_standalone_app


color_palette = [
    'rgb(128, 0, 96)',
    'rgb(230, 115, 0)',
    'rgb(255, 191, 0)'
]



def header_colors():
    return {
        'bg_color': '#232323',
        'font_color': 'white'
    }


def filter_df(df,año,tipo,sexo,den=None):
 dff=df.copy()
 var=''
 if(año!='TOD'):
    dff=dff[dff['año']==año]
 if(den=='DEN'):
    if(sexo=='HOM'):
        var='tasah' 
    if(sexo=='MUJ'):
        var='tasam'
    if(sexo=='TOD'):
        var='tasat'
 else:
    if(sexo=='HOM'):
        var='casosh' 
    if(sexo=='MUJ'):
        var='casosm'
    if(sexo=='TOD'):
        var='total'
 
 return dff,var 

    
#oth_grouped=calctasas(oth_grouped)
#par_grouped=calctasas(par_grouped)
 
 #dff['Fecha']=pd.to_datetime(df['Fecha'], format='%Y-%m-%d %H:%M:%S') 
 #Gender filter
 #dff=dff[dff['sexo']==sexo]
 #location filter
 #if(len(sitio)>0):
  # dff=dff[dff['Clase de sitio'].isin(sitio)]
  #zona filter
 #dff=dff[dff['Zona'] == zona]  
 #if(len(arma)>0):
  # dff=dff[dff['Arma empleada'].isin(arma)]
 #start_date filter
 #dff=dff[dff['Fecha']>start_date]
 #end_date filter 
 #dff=dff[dff['Fecha']<=end_date]
 return dff

def calculate_vics(df, states=None, start_date=None, end_date=None):
    data = []
    dff = df.copy()
    by_date = dff >> group_by(X.Fecha) >> summarize(Cases = X.Fecha.count())
    #sns.lineplot(x = 'Fecha', y = 'Cases', data = by_date, palette='viridis')
    if states:
        dff = dff[(df['State_abbr'].isin(states))]
        
    if  start_date and end_date:
        dff = dff[(df['Fecha'] >= start_date) & (df['Fecha'] <= end_date)]

    #subcategory_grouped = dff.groupby(['Category'], as_index=False)
    #for name, group in subcategory_grouped:
     #   grouped = group.groupby('YearMonth', as_index=False).sum()
    data.append(go.Scatter(x=by_date['Fecha'], y=by_date['Cases'],marker=dict(size=15, color='#FFBF00')))
    
    return data

def calculate_bar(df, dpto,sexo):
     data = []
     dff = df.copy()
     dff['Mun_corrected'] = dff['Municipio'].map(col_state_abbrev)
     dff=dff[dff['Mun_corrected']==dpto]
     dff=calctasas(dff) 
     var='total'
     data.append(go.Bar(x=dff['año'], y=dff['casosh'],name='Casos hombres', marker_color='#FFBF00'))
     data.append(go.Bar(x=dff['año'], y=dff['casosm'],name='Casos mujeres',marker_color='red'))
     
     return data

def calculate_desencadenante():
     data = []
     #dff = df.copy()
     #dff['Mun_corrected'] = dff['Municipio'].map(col_state_abbrev)
     #dff=dff[dff['Mun_corrected']==dpto]
     #dff=calctasas(dff) 
     #var='total'
     data.append(go.Bar(x=['Intolerancia,Machismo'], y=['56.75'],name='Hombres', marker_color='#FFBF00'))
     data.append(go.Bar(x=['Intolerancia,Machismo'], y=['46.34'],name='Mujeres', marker_color='red'))
     data.append(go.Bar(x=['Celos,desconfianza,infidelidad'], y=['29.71'],name='Hombres', marker_color='#FFBF00'))
     data.append(go.Bar(x=['Celos,desconfianza,infidelidad'], y=['36.75'],name='Mujeres', marker_color='red'))
     data.append(go.Bar(x=['Alcoholismo/Drogadiccion'], y=['9.41'],name='Hombres', marker_color='#FFBF00'))
     data.append(go.Bar(x=['Alcoholismo/Drogadiccion'], y=['14.07'],name='Mujeres', marker_color='red'))
     data.append(go.Bar(x=['Economicas'], y=['0.94'],name='Hombres', marker_color='#FFBF00'))
     data.append(go.Bar(x=['Economicas'], y=['0.39'],name='Mujeres', marker_color='red'))
     #data.append(go.Bar(x=dff['año'], y=dff['casosm'],name='Casos mujeres',marker_color='red'))
     
     return data     

def layout():

    return html.Div(id='clustergram-body', className='row app-body',
    style={'margin':'0'},
     children=[


            #dcc.Loading(className='dashbio-loading', children=
            html.Div(
                id='clustergram-wrapper',
                  style={
                    'padding': '30px',
                    'font-size': '20pt',
                    'display':'inline  !important'
                },
        children=[ 
            
          
            
            dcc.Graph(
            id='map-chart',
           # style={'padding': '120px','backgroundColor':'#232323','margin':'0'},    
            
            figure={ 
                
            }
        )]),
      html.Div(
                id='graph1',    
        children=[ 
             html.H4("CASOS REPORTADOS EN EL TIEMPO"),
        dcc.Graph(
                           id='map1', # Plot 1
                            figure={
                                'data': calculate_bar(dfallpar, 'CUNDINAMARCA','total'),
                                'layout': go.Layout(
                                    width=400,
                                    height=250,
                                    paper_bgcolor='rgba(0,0,0,0)',
                                    plot_bgcolor='rgba(0,0,0,0)',
                                    margin={"r":0,"t":0,"l":30,"b":30},
                                    #margin={'t': 10, 'r': 10,}
                                )
                            },
                        ),
             html.H4("Factor desencadenante"),
             dcc.Graph(
                           id='map2', # Plot 1
                            figure={
                                'data': calculate_desencadenante(),
                                'layout': go.Layout(
                                    width=400,
                                    height=250,
                                    paper_bgcolor='rgba(0,0,0,0)',
                                    plot_bgcolor='rgba(0,0,0,0)',
                                    margin={"r":0,"t":0,"l":30,"b":30},
                                    #margin={'t': 10, 'r': 10,}
                                )
                            },
                        ),
                          ]),
                         
                        
                      


        
      
       
     
        
        html.Div(id='clustergram-control-tabs', className='control-tabs', children=[
            dcc.Tabs(id='clustergram-tabs', value='what-is', children=[
                dcc.Tab(
                    label='Introducción',
                    value='what-is',
                    children=html.Div(className='control-tab', children=[
                        html.H4(className='what-is', children='Violencia Intrafamiliar en Colombia'),
                        html.P('La Violencia Intrafamiliar en Colombia es .....'),
                        html.P(''),
                        html.P(''),
                        html.P('.')
                    ])
                ),
                dcc.Tab(
                    label='Data',
                    value='datasets',
                    children=html.Div(className='control-tab', children=[
                            html.Br(),
                             html.Div(
                            'Tipo de violencia intrafamiliar',
                            title='Tipo de violencia intrafamiliar',
                            className='fullwidth-app-controls-name',
                        ),


                           dcc.Dropdown(
                                        id="tipo-select",
                                        options=[
                                                {'label': 'Niñez y Adolecentes', 'value': 'NNA'},
                                                {'label': 'Ancianos', 'value': 'OLD'},
                                                {'label': 'Pareja', 'value': 'PAR'},
                                                {'label': 'Otros', 'value': 'OTH'},
                                               
                                        ],
                                        value='NNA'
                                        
                                    ),
                                    html.Br(),
                        html.Div(
                            'Año',
                            title='Año',
                            className='fullwidth-app-controls-name',
                        ),


                           dcc.Dropdown(
                                        id="año-select",
                                        options=[
                                                {'label': '2016', 'value': '2016'},
                                                {'label': '2017', 'value': '2017'},
                                                {'label': '2018', 'value': '2018'},
                                                {'label': 'Todos', 'value': 'TOD'},
                                               
                                        ],
                                        value='TOD'
                                        
                                    ),
                                       html.Br(),
                        html.Div(
                            'Sexo',
                            title='Sexo',
                            className='fullwidth-app-controls-name',
                        ),


                                 dcc.RadioItems(
                                        id="sexo-select",
                                        options=[
                                                {'label': 'Hombre', 'value': 'HOM'},
                                                {'label': 'Mujer', 'value': 'MUJ'},
                                                {'label': 'Todos', 'value': 'TOD'}
                                               
                                        ],
                                        value='TOD',
                                        labelStyle={'display': 'inline-block'}
                                    ),
                                     html.Br(),
                        html.Div(
                            'Conteo',
                            title='Conteo',
                            className='fullwidth-app-controls-name',
                        ),


                           dcc.RadioItems(
                                        id="den-select",
                                        options=[
                                                {'label': 'Total', 'value': 'TOT'},
                                                {'label': 'Densidad', 'value': 'DEN'}
                                                
                                        ],
                                        value='DEN',
                                        labelStyle={'display': 'inline-block'}
                                    ),
                       

                       
                    ])
                ),
                
            ])])])
    

def callbacks(_app):

    
    @_app.callback(
    #[
        dash.dependencies.Output('map-chart','figure' ),
        #dash.dependencies.Output('map1','figure' ),
        #dash.dependencies.Output('map2','figure' )
      #  ],
    #dash.dependencies.Output('debug', 'children')],
    [
        dash.dependencies.Input('año-select', 'value'), 
        dash.dependencies.Input('tipo-select', 'value'),
        dash.dependencies.Input('sexo-select', 'value'),
         dash.dependencies.Input('den-select', 'value')

    ])
    def update_map(año,tipo,sexo,den):
            if(tipo=='NNA'):
                dff,var = filter_df(dfallnna,año,tipo,sexo,den)
            elif(tipo=='OTH'):
                dff,var = filter_df(dfalloth,año,tipo,sexo,den)
            elif(tipo=='OLD'):
                dff,var = filter_df(dfallold,año,tipo,sexo,den)
            elif(tipo=='PAR'):
                dff,var = filter_df(dfallpar,año,tipo,sexo,den)
           
        
            
            dff['Mun_corrected'] = dff['Municipio'].map(col_state_abbrev)
            dff=calctasas(dff)
            var_grouped = dff.groupby(['Mun_corrected'], as_index=False).sum()

      
      ##
            
            mapreturn={ 
                    'data': [go.Choroplethmapbox(
                        geojson=geojson,
                        locations=var_grouped['Mun_corrected'],
                        z=var_grouped[var],
                        colorscale='Viridis',
                        colorbar_title="Casos x 100.000 habitantes",
                        hoverinfo='location+z'
                        
                    )],
                    'layout': go.Layout(
                        
                            autosize=False,
                            width=500,
                            height=600,
                            mapbox_style="dark",
                            mapbox_accesstoken=token,
                            mapbox_zoom=4.4,
                            paper_bgcolor='rgba(0,0,0,0)',
                            plot_bgcolor='rgba(0,0,0,0)',
                            margin={"r":0,"t":20,"l":0,"b":0},
                            mapbox_center = {"lat": 4.7110, "lon": -74.0721}
                            
                        )
            }
            

            return mapreturn

       

        

        #,[ html.H6(start),html.H6(end),html.H6(start),html.H6(sexo),html.H6(location),html.H6(arma),html.H6(zona),html.H6(zona)]

    

    @_app.callback(
        Output('map1', 'figure'),
        [Input('map-chart', 'clickData'),
        dash.dependencies.Input('año-select', 'value'), 
        dash.dependencies.Input('tipo-select', 'value'),
        dash.dependencies.Input('sexo-select', 'value')
        ])
    def display_click_data(clickData,año,tipo,sexo):
       json_dict = json.loads(json.dumps(clickData))
      
       dpto=""
       if(tipo=='NNA'):
            dff,var = filter_df(dfallnna,año,tipo,sexo)
       elif(tipo=='OTH'):
            dff,var = filter_df(dfalloth,año,tipo,sexo)
       elif(tipo=='OLD'):
            dff,var = filter_df(dfallold,año,tipo,sexo)
       elif(tipo=='PAR'):
            dff,var = filter_df(dfallpar,año,tipo,sexo)  
       if(json_dict): 
            dpto=str(json_dict['points'][0]['location'])
            fig=calculate_bar(dff, dpto,sexo)
       else:
           dff,var = filter_df(dfallpar,'TOD',tipo,'TOD') 
           fig=calculate_bar(dff, 'CUNDINAMARCA',sexo)
       
       return  {
                                    'data': fig,
                                    'layout': go.Layout(
                                        width=400,
                                        height=250,
                                        paper_bgcolor='rgba(0,0,0,0)',
                                        plot_bgcolor='rgba(0,0,0,0)',
                                        margin={"r":0,"t":0,"l":30,"b":30},
                                        #margin={'t': 10, 'r': 10,}
                                    )
                                }   
        
 
# only declare app/server if the file is being run directly
if 'DASH_PATH_ROUTING' in os.environ or __name__ == '__main__':
    app = run_standalone_app(layout, callbacks, header_colors, __file__)
    server = app.server

if __name__ == '__main__':
    app.run_server(debug=True,host='0.0.0.0', port=8050)
